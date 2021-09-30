using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using StoreLocator.Domain;
using System.Threading.Tasks;

namespace StoreLocator.ApiFunction
{
    public static class StoresAreaSearchFunction
    {
        [FunctionName(nameof(StoresAreaSearchFunction))]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = "stores/areasearch")]
            HttpRequest req,
            ILogger log)
        {
            var storeSearcher = new StoreSearcher(
                Config.SearchApiKey,
                Config.SearchServiceName,
                Config.SearchIndex);

            var requestJson = await req.ReadAsStringAsync();
            var queryRequest = JsonConvert.DeserializeObject<StoreAreaQueryRequest>(requestJson);
            var queryResponse = await storeSearcher.SearchAsync(queryRequest);
            return new OkObjectResult(queryResponse);
        }
    }
}
