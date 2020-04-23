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
    public static class StoresCosmosSearchFunction
    {
        private const string Query = "SELECT * FROM c WHERE ST_DISTANCE(c.location, {'type': 'Point', 'coordinates': [@lat, @lng] }) < @distance";

        [FunctionName(nameof(StoresCosmosSearchFunction))]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "stores/cosmossearch")] HttpRequest req,
            [CosmosDB(ConnectionStringSetting = "CosmosDbConnectionString")]
            DocumentClient client,
            ILogger log)
        {
            var collectionUri = UriFactory.CreateDocumentCollectionUri("opap-stores-cdb", "stores");

            var queryBuilder = new StringBuilder(Query);
            var parameters = new SqlParameterCollection()
            {
                new SqlParameter("@lat", decimal.Parse(req.Query["lat"], CultureInfo.InvariantCulture)),
                new SqlParameter("@lng", decimal.Parse(req.Query["lng"], CultureInfo.InvariantCulture)),
                new SqlParameter("@distance", int.Parse(req.Query["distance"]))
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

        public class StoreSearchQuery
        {
            public long Latitude { get; set; }
            public long Longitude { get; set; }
            public int Distance { get; set; }
            public string Amenity { get; set; }
        }
    }
}
