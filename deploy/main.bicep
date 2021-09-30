param naming object
param location string = resourceGroup().location

@description('The location in which the CosmosDB resources should be deployed.')
param cosmosDbLocation string = resourceGroup().location

param tags object

@description('The throughput for the database to be shared')
@minValue(400)
@maxValue(1000000)
param cosmosDbThroughput int = 400

@description('API Management publisher email.')
param apiPublisherEmail string = 'admin@storeloc8tr.com'

@description('API Management publisher name.')
param apiPublisherName string = 'Store Owner'


var sourceCodeRepositoryUrl = 'https://github.com/nianton/storelocator-demo.git'
var sourceCodeBranch = 'master'

var resourceNames = {
  keyVault: naming.keyVault.nameUnique  
  functionApp: naming.functionApp.name
  apiManagement: naming.apiManagement.name
  storage: naming.storageAccount.nameUnique
  cosmosDbAccount: naming.cosmosdbAccount.name
  cosmosDbDatabase: 'storesDb'
  cosmosDbStoresCollection: 'stores'
  cognitiveSearch: naming.cognitiveSearch.name
  mapAccount: naming.mapsAccount.name
  cdnEndpoint: naming.cdnEndpoint.name
  cdnProfile: naming.cdnProfile.name
}

var cdnOrigin = '${resourceNames.storage}.blob.${environment().suffixes.storage}'

var secretNames = {
  storageConnectionString: 'storageConnectionString'
  cosmosDbConnectionString: 'cosmosDbConnectionString'
}

var cosmosDbLocations = [
  {
    locationName: cosmosDbLocation
    failoverPriority: 0
    isZoneRedundant: false
  }
]

resource cosmosDbAccount 'Microsoft.DocumentDB/databaseAccounts@2019-08-01' = {
  name: resourceNames.cosmosDbAccount
  kind: 'GlobalDocumentDB'
  location: cosmosDbLocation
  properties: {
    consistencyPolicy: {
      defaultConsistencyLevel: 'Session'
    }
    locations: cosmosDbLocations
    databaseAccountOfferType: 'Standard'
    enableAutomaticFailover: false
    enableMultipleWriteLocations: false
  }
}

resource cosmosDbDatabase 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases@2019-08-01' = {
  parent: cosmosDbAccount
  name: resourceNames.cosmosDbDatabase
  properties: {
    resource: {
      id: resourceNames.cosmosDbDatabase
    }
    options: {
      throughput: '${cosmosDbThroughput}'
    }
  }
}

resource cosmosDbContainer 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2019-08-01' = {
  parent: cosmosDbDatabase
  name: resourceNames.cosmosDbStoresCollection
  properties: {
    options: { }
    resource: {
      id: resourceNames.cosmosDbStoresCollection
      partitionKey: {
        paths: [
          '/id'
        ]
        kind: 'Hash'
      }
      indexingPolicy: {
        indexingMode: 'Consistent'
        includedPaths: [
          {
            path: '/*'
          }
        ]
        excludedPaths: [
          {
            path: '/myPathToNotIndex/*'
          }
        ]
      }
    }
  }
}

// Function Application (with respected Application Insights and Storage Account)
// with the respective configuration, and deployment of the application
module functionApp './modules/functionApp.module.bicep' = {
  name: 'FunctionAppDeployment'
  params: {
    location: location
    name: resourceNames.functionApp
    managedIdentity: true
    tags: tags
    skuName: 'Y1'
    funcDeployBranch: sourceCodeBranch
    funcDeployRepoUrl: sourceCodeRepositoryUrl
    funcAppSettings: [
      {
        name: 'DataStorageConnection'
        value: '@Microsoft.KeyVault(VaultName=${resourceNames.keyVault};SecretName=${secretNames.storageConnectionString})'
      }
      {
        name: 'CosmosDbConnectionString'
        value: '@Microsoft.KeyVault(VaultName=${resourceNames.keyVault};SecretName=${secretNames.cosmosDbConnectionString})'
      }
      {
        name: 'CosmosDbName'
        value: resourceNames.cosmosDbDatabase
      }
      {
        name: 'CosmosDbContainerName'
        value: resourceNames.cosmosDbStoresCollection
      }
    ]
  }
}

module keyVault 'modules/keyvault.module.bicep' = {
  name: 'KeyVaultDeployment'
  params: {
    name: resourceNames.keyVault
    location: location
    skuName: 'premium'
    tags: tags
    accessPolicies: [
      {
        tenantId: functionApp.outputs.identity.tenantId
        objectId: functionApp.outputs.identity.principalId
        permissions: {
          secrets: [
            'get'
          ]
        }
      }
    ]
    secrets: [
      {
        name: secretNames.storageConnectionString
        value: storage.outputs.connectionString
      }
      {
        name: secretNames.cosmosDbConnectionString
        value: listConnectionStrings(cosmosDbAccount.id, cosmosDbAccount.apiVersion).connectionStrings[0].connectionString
      }
    ]
  }
}

module storage 'modules/storage.module.bicep' = {
  name: 'StorageAccountDeployment'
  params: {
    location: location
    kind: 'StorageV2'
    skuName: 'Standard_LRS'
    name: resourceNames.storage
    tags: tags
  }
}

resource cdnProfile 'Microsoft.Cdn/profiles@2020-09-01' = {
  sku: {
    name: 'Standard_Microsoft'
  }
  name: resourceNames.cdnProfile
  location: location
  tags: tags
  dependsOn: [
    storage
  ]
}

resource cdnEndpoint 'Microsoft.Cdn/profiles/endpoints@2020-09-01' = {
  parent: cdnProfile
  name: resourceNames.cdnEndpoint
  location: location
  tags: tags
  properties: {
    originHostHeader: cdnOrigin
    isHttpAllowed: true
    isHttpsAllowed: true
    queryStringCachingBehavior: 'IgnoreQueryString'
    originPath: null
    origins: [
      {
        name: replace(cdnOrigin, '.', '-')
        properties: {
          hostName: cdnOrigin
          httpPort: 80
          httpsPort: 443
        }
      }
    ]
    contentTypesToCompress: [
      'text/plain'
      'text/html'
      'text/css'
      'text/javascript'
      'application/x-javascript'
      'application/javascript'
      'application/json'
      'application/xml'
    ]
    isCompressionEnabled: true
  }
}

resource mapsAccount 'Microsoft.Maps/accounts@2018-05-01' = {
  name: resourceNames.mapAccount
  location: 'global'
  sku: {
    name: 'S0'
  }
  tags: tags
}

resource apiManagementService 'Microsoft.ApiManagement/service@2019-01-01' = {
  name: resourceNames.apiManagement
  location: location
  tags: {}
  sku: {
    name: 'Consumption'
  }
  properties: {
    publisherEmail: apiPublisherEmail
    publisherName: apiPublisherName
  }
}

resource searchService 'Microsoft.Search/searchServices@2015-08-19' = {
  name: resourceNames.cognitiveSearch
  location: location
  sku: {
    name: 'free'
  }
  tags: tags
  properties: {
    replicaCount: 1
    partitionCount: 1
    hostingMode: 'default'
  }
}

output storageAccountName string = storage.outputs.name
