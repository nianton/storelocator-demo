using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using StoreLocator.Domain;
using System;
using System.Threading.Tasks;

namespace StoreLocator.ApiFunction
{
    public static class StoresSearchFunction
    {
        [FunctionName(nameof(StoresSearchFunction))]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = "stores/search")] HttpRequest req,
            ILogger log)
        {
            var storeSearcher = new StoreSearcher(
                Environment.GetEnvironmentVariable("SearchApiKey"),
                Environment.GetEnvironmentVariable("SearchServiceName"),
                Environment.GetEnvironmentVariable("SearchIndex"));
            var body = await req.ReadAsStringAsync();
            var queryRequest = JsonConvert.DeserializeObject<StoreDistanceQueryRequest>(body);
            var queryResponse = await storeSearcher.SearchAsync(queryRequest);
            return new OkObjectResult(queryResponse);
        }
    }
}
