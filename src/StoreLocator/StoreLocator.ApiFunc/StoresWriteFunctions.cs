using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using StoreLocator.Domain;
using System;
using System.Threading.Tasks;

namespace StoreLocator.ApiFunction
{
    public class StoresWriteFunctions
    {
        public StoresWriteFunctions(IDocumentClient documentClient)
        {
            this.documentClient = documentClient;
        }

        protected IDocumentClient documentClient { get; }

        [FunctionName(nameof(StoreCreateFunction))]
        public async Task<IActionResult> StoreCreateFunction(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = "stores")] HttpRequest req,
            [CosmosDB("%CosmosDbName%", "%CosmosDbContainerName%", ConnectionStringSetting = "CosmosDbConnectionString")]
            IAsyncCollector<Store> stores,
            ILogger log)
        {
            var storeJson = await req.ReadAsStringAsync();
            var store = JsonConvert.DeserializeObject<Store>(storeJson);
            store.Id = Guid.NewGuid();
            await stores.AddAsync(store);
            return new CreatedResult($"/api/stores/{store.Id}", store);
        }

        [FunctionName(nameof(StoreDeleteFunction))]
        public async Task<IActionResult> StoreDeleteFunction(
            [HttpTrigger(AuthorizationLevel.Function, "delete", Route = "stores/{id}")] HttpRequest req,
            string id,
            [CosmosDB("%CosmosDbName%", "%CosmosDbContainerName%", ConnectionStringSetting = "CosmosDbConnectionString")]
            DocumentClient client,
            ILogger log)
        {
            var documentLink = UriFactory.CreateDocumentUri(Config.CosmosDbName, Config.CosmosDbContainerName, id);
            var response =  await client.DeleteDocumentAsync(documentLink);

            return new OkResult();
        }
    }
}