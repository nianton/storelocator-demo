using Microsoft.Azure.Cosmos;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace StoreLocator.Seed
{
    class Program
    {
        const string CosmosDBName = "storeloc8tr-cdb";
        const string CosmosDBContainerName = "stores";
        const string CosmosDbConnectionString = "AccountEndpoint=https://storeloc8tr-demo-cdbacc.documents.azure.com:443/;AccountKey=eFAnG6UOlDajEfRH3xKrNwCFfjYvSnV6LbsKS0hSJcKexXdzJ75wh40z52zPXlV541ZFTa1aFO48ZqswjFtlsA==;";// "AccountEndpoint=https://opap-storelocator-cdbac.documents.azure.com:443/;AccountKey=2l7HeiM3aNhCLu9wF4KPcE5TU11H7VsGdUgfyacZK1Q0g0H8vDhZ7hXoXYhuyJFEOChjmWWmLxJg6JNlComaYg==;";
        static int Count = 0;
        static readonly CosmosClient cosmosClient = new CosmosClient(CosmosDbConnectionString);

        static async Task Main(string[] args)
        {
            Console.WriteLine("Welcome to the data generator for StoreLocator!");
            Console.WriteLine();

            await CreateSampleData();

            Console.WriteLine();
            Console.Write("Press any key to exit...");
            Console.ReadKey();
        }

        static async Task CreateSampleData()
        {
            var dataJson = File.ReadAllText("data.json");
            var addressesJson = File.ReadAllText("addresses.json");
            var stores = JsonConvert.DeserializeObject<List<JObject>>(dataJson);
            var addresses = JsonConvert.DeserializeObject<List<JObject>>(addressesJson);
            var container = cosmosClient.GetContainer(CosmosDBName, CosmosDBContainerName);
            var rnd = new Random(DateTime.Now.Millisecond);


            // Shuffle requests
            stores = stores.OrderBy(x => Guid.NewGuid()).ToList();
            Console.WriteLine($"**** Total {stores.Count} Stores to be created");

            var batches = Batch(addresses, 9);
            foreach (var batch in batches)
            {
                var tasks = batch.Where(address => address != null)
                    .Take(3)
                    .Select(address => AddStoreAsync(container, address, stores[rnd.Next(stores.Count)]))
                    .ToArray();

                await Task.WhenAll(tasks);
            }

            Console.WriteLine();
            Console.WriteLine($"Created {Count} Stores. Press any key to exit...");
            Console.ReadKey();
        }

        async static Task AddStoreAsync(Container container, JObject address, JObject store)
        {
            store["id"] = Guid.NewGuid().ToString();            
            store["location"] = address["position"];
            address.Remove("position");
            store["address"] = address;

            await container.CreateItemAsync(store);
            Interlocked.Increment(ref Count);
        }

        static IEnumerable<IEnumerable<T>> Batch<T>(IEnumerable<T> items, int maxItems)
        {
            return items.Select((item, idx) => new { item, idx })
                        .GroupBy(x => x.idx / maxItems)
                        .Select(g => g.Select(x => x.item));
        }
    }
}
