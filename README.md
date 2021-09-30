# StoreLocator Demo
This is my serverless session demo, about how leverage Azure services in the most cost-effective manner to create a scalable cloud-native/serverless application costing no more than a beer a month. As the scenario, we used a fictional store locator to demonstrate all components used in such an application.

The services used by this application are:
- Azure Functions
- API Management
- Azure Active Directory B2C
- Cosmos DB
- Blob Storage
- Azure Search

Below is the high-level architecture on Azure for this application:

![Artitectural Diagram](./assets/storelocator-diagram.png?raw=true)

If you want to try out and experiment with this application, you can directly deploy it on your Azure subscription clicking the button below:

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fnianton%2Fstorelocator-demo%2Fmaster%2Fdeploy%2Fazuredeploy.json)
