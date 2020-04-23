using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using StoreLocator.Domain;
using System.Threading.Tasks;

namespace StoreLocator.ApiFunction
{
    public static class StoresGetFunction
    {
        [FunctionName("StoresGetFunction")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "stores/{posType}/{id}")] HttpRequest req,
            [CosmosDB("%CosmosDbName%", "%CosmosDbCollectionName%", ConnectionStringSetting = "CosmosDbConnection", Id = "{id}", PartitionKey = "{posType}")]
            Store store,
            ILogger log)
        {
            await Task.Yield();

            log.LogInformation("C# HTTP trigger function processed a request.");
            if (store == null)
                return new NotFoundObjectResult(new { error = "Please provide a valid id for the store." });

            return new OkObjectResult(store);
        }
    }
}
