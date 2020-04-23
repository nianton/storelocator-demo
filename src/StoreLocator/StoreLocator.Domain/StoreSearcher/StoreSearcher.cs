using Microsoft.Azure.Search;
using Microsoft.Azure.Search.Models;
using StoreLocator.Domain.Extensions;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace StoreLocator.Domain
{
    public class StoreSearcher : IStoreSearcher
    {
        private static readonly HttpClient httpClient = new HttpClient();
        private readonly ISearchIndexClient searchIndexClient;

        public StoreSearcher(string apiKey, string searchServiceName, string indexName)
        {
            var credentials = new SearchCredentials(apiKey);
            searchIndexClient = new SearchIndexClient(credentials, httpClient, false)
            {
                SearchServiceName = searchServiceName,
                IndexName = indexName,
                UseHttpGetForQueries = true
            };
        }

        public async Task<Store> GetStoreAsync(int storeId)
        {
            var model = await this.searchIndexClient.Documents.GetAsync<Store>(storeId.ToString());
            return model;
        }

        public async Task<StoreQueryResponse> SearchAsync(StoreQueryRequest query)
        {
            var searchParameters = new SearchParameters()
            {
                IncludeTotalResultCount = true,
                SearchMode = SearchMode.All,
                Filter = BuildFilter(query)
            };

            var result = await this.searchIndexClient.Documents.SearchAsync<Store>("*", searchParameters);
            var response = new StoreQueryResponse()
            {
                TotalCount = result.Count.GetValueOrDefault(),
                Results = result.Results.Select(sr => sr.Document).ToList()
            };

            return response;
        }

        private string BuildFilter(StoreQueryRequest query)
        {
            var filterClauses = new List<string>();
            if (query is StoreDistanceQueryRequest distanceQuery)
            {
                var location = new GeoLocation() { Type = "Point", Coordinates = new[] { distanceQuery.Latitude, distanceQuery.Longitude } };
                var distanceFilter = string.Format(
                    CultureInfo.InvariantCulture, 
                    "geo.distance(location, geography'{0}') le {1}", 
                    location.AsPoint(), 
                    distanceQuery.Distance);

                filterClauses.Add(distanceFilter);
            }
            else if (query is StoreAreaQueryRequest areaQuery)
            {
                var northWest = new GeoLocation() { Type = "Point", Coordinates = new[] { areaQuery.NwLatitude, areaQuery.NwLongitude } };
                var southEast = new GeoLocation() { Type = "Point", Coordinates = new[] { areaQuery.SeLatitude, areaQuery.SeLongitude } };
                var distanceFilter = string.Format(
                    CultureInfo.InvariantCulture,
                    "geo.intersects(location, geography'{0}')",
                    northWest.AsPolygon(southEast));

                filterClauses.Add(distanceFilter);
            }

            return string.Join(" and ", filterClauses);
         }
    }
}
