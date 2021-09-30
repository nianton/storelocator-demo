using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;
using Microsoft.Azure.Documents.Linq;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using StoreLocator.Domain;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StoreLocator.ApiFunction
{
    public static class StoresCosmosAreaSearchFunction
    {
        private const string Query = "SELECT * FROM c WHERE ST_WITHIN(c.location, {'type': 'Polygon', 'coordinates': [[[@lat1, @lng1],[@lat2, @lng1],[@lat2, @lng2],[@lat1, @lng2]]] }) < @distance";

        [FunctionName(nameof(StoresCosmosAreaSearchFunction))]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "stores/cosmosareasearch")] HttpRequest req,
            [CosmosDB(ConnectionStringSetting = "CosmosDbConnectionString")]
            DocumentClient client,
            ILogger log)
        {
            var collectionUri = UriFactory.CreateDocumentCollectionUri("stores-cdb", "stores");

            var queryBuilder = new StringBuilder(Query);
            var parameters = new SqlParameterCollection()
            {
                new SqlParameter("@lat1", decimal.Parse(req.Query["lat1"], CultureInfo.InvariantCulture)),
                new SqlParameter("@lng1", decimal.Parse(req.Query["lng1"], CultureInfo.InvariantCulture)),
                new SqlParameter("@lat2", decimal.Parse(req.Query["lat2"], CultureInfo.InvariantCulture)),
                new SqlParameter("@lng2", decimal.Parse(req.Query["lng2"], CultureInfo.InvariantCulture)),
            };

            if (req.Query.TryGetValue("amenity", out var amenity) && !string.IsNullOrWhiteSpace(amenity))
            {
                queryBuilder.Append(" AND ARRAY_CONTAINS(c.amenities, @amenity)");
                parameters.Add(new SqlParameter("@amenity", amenity.ToString()));
            }

            var query = client.CreateDocumentQuery<Store>(collectionUri, 
                new SqlQuerySpec(queryBuilder.ToString(), parameters), 
                new FeedOptions { EnableCrossPartitionQuery = true });

            var storesFeed = await query.AsDocumentQuery().ExecuteNextAsync<Store>();
            return new OkObjectResult(new { total = storesFeed.Count(), items = storesFeed.ToList() });
        }
    }
}
