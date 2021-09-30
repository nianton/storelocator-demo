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
        const string CosmosDBName = "storesDb";
        const string CosmosDBContainerName = "stores";
        const string CosmosDbConnectionString = "AccountEndpoint=https://cosmos-storeloc8r-demo.documents.azure.com:443/;AccountKey=eE8DRk6tmT11ks3dDDZF0sw7TcZYSaNDcnmtYdZdzdjay0M8GBtvbfO3mWn7tcR2T3Z7NEiy8QgMYhkYnZ1CoA==;";
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
