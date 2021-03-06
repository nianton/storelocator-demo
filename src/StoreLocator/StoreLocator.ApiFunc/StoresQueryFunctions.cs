using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;
using Microsoft.Azure.Documents.Linq;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using StoreLocator.Domain;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace StoreLocator.ApiFunction
{
    public class StoresQueryFunctions
    {
        public StoresQueryFunctions(IDocumentClient documentClient)
        {
            this.documentClient = documentClient;
        }

        protected IDocumentClient documentClient { get; }

        [FunctionName(nameof(HealthFunction))]
        public IActionResult HealthFunction(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "health")] HttpRequest req, 
            ILogger log)
        {
            log.LogInformation("Application is healthy.");
            return new OkObjectResult("healthy");
        }

        [FunctionName(nameof(StoresGetFunction))]
        public async Task<IActionResult> StoresGetFunction(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "stores/{posType}/{id}")] HttpRequest req,
            [CosmosDB("%CosmosDbName%", "%CosmosDbContainerName%", ConnectionStringSetting = "CosmosDbConnectionString", Id = "{id}", PartitionKey = "{posType}")]
            Store store,
            ILogger log)
        {
            await Task.Yield();

            log.LogInformation("C# HTTP trigger function processed a request.");
            if (store == null)
                return new NotFoundObjectResult(new { error = "Please provide a valid id for the store." });

            return new OkObjectResult(store);
        }

        [FunctionName(nameof(StoresGetAllFunction))]
        public async Task<IActionResult> StoresGetAllFunction(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "stores")] HttpRequest req,
            ILogger log)
        {
            await Task.Yield();
            log.LogInformation("New area request query arrived");

            var querySpec = new SqlQuerySpec($"select m.id, m.posType, m.address, m.location.coordinates from exitmessages m");

            var result = await ExecuteQueryAsync<StoreInfo>(querySpec);
            return new OkObjectResult(result);
        }

        [FunctionName(nameof(StoresGetCountsFunction))]
        public async Task<IActionResult> StoresGetCountsFunction(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "stores/counts")] HttpRequest req,
            ILogger log)
        {
            await Task.Yield();
            log.LogInformation("New stores count query arrived"); 

            var querySpec = new SqlQuerySpec($"SELECT VALUE root FROM (SELECT COUNT(1) AS storeCount, s.posType FROM stores s GROUP BY s.posType) as root");

            var result = await ExecuteQueryAsync<StorePosTypeCount>(querySpec);
            return new OkObjectResult(result);
        }

        /// <summary>
        /// Executes asynchronously a CosmosDB query (exhaustive -all pages).
        /// </summary>
        /// <returns>The results as a list.</returns>
        private async Task<List<TItem>> ExecuteQueryAsync<TItem>(SqlQuerySpec querySpec, string containerName = null, bool enableCrossPartitionQuery = true)
        {
            var collectionUri = UriFactory.CreateDocumentCollectionUri(Config.CosmosDbName, containerName ?? Config.CosmosDbContainerName);
            var query = documentClient.CreateDocumentQuery<TItem>(collectionUri, querySpec, new FeedOptions
            {
                EnableCrossPartitionQuery = enableCrossPartitionQuery,
                MaxItemCount = -1 // Use dynamic paging
            });

            var results = new List<TItem>();
            var documentQuery = query.AsDocumentQuery();
            while (documentQuery.HasMoreResults)
            {
                var partialResults = await documentQuery.ExecuteNextAsync<TItem>();
                results.AddRange(partialResults);
            }

            return results;
        }
    }
}
