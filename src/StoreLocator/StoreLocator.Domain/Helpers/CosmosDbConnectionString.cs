using System;
using System.Data.Common;

namespace StoreLocator.Domain.Helpers
{
    public class CosmosDBConnectionString
    {
        public CosmosDBConnectionString(string connectionString)
        {
            DbConnectionStringBuilder builder = new DbConnectionStringBuilder
            {
                ConnectionString = connectionString
            };

            if (builder.TryGetValue("AccountKey", out object key))
            {
                AuthKey = key.ToString();
            }

            if (builder.TryGetValue("AccountEndpoint", out object uri))
            {
                ServiceEndpoint = new Uri(uri.ToString());
            }
        }

        public Uri ServiceEndpoint { get; set; }

        public string AuthKey { get; set; }
    }
}
