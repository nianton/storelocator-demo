using System;
using System.Collections.Generic;
using System.Text;

namespace StoreLocator.ApiFunction
{
    public static class Config
    {
        static Config()
        {
            SearchApiKey = Environment.GetEnvironmentVariable("SearchApiKey");
            SearchServiceName = Environment.GetEnvironmentVariable("SearchServiceName");
            SearchIndex = Environment.GetEnvironmentVariable("SearchIndex");
            CosmosDbName = Environment.GetEnvironmentVariable("CosmosDbName");
            CosmosDbContainerName = Environment.GetEnvironmentVariable("CosmosDbContainerName");
            CosmosDbConnectionString = Environment.GetEnvironmentVariable("CosmosDbConnectionString");
        }

        public static string SearchApiKey {get;}
        public static string SearchServiceName { get; }
        public static string SearchIndex { get; }
        public static string CosmosDbName { get; }
        public static string CosmosDbContainerName { get; }
        public static string CosmosDbConnectionString { get; }
    }
}
