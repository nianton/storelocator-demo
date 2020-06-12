using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection;
using StoreLocator.Domain.Helpers;
using System;

[assembly: FunctionsStartup(typeof(StoreLocator.ApiFunction.Startup))]
namespace StoreLocator.ApiFunction
{
    public class Startup : FunctionsStartup
    {
        public override void Configure(IFunctionsHostBuilder builder)
        {
            builder.Services.AddHttpClient();
            builder.Services.AddSingleton<IDocumentClient, DocumentClient>((sp) => DocumentClientFactory());
        }

        private static DocumentClient DocumentClientFactory()
        {
            var connectionString = new CosmosDBConnectionString(Config.CosmosDBConnectionString);
            return new DocumentClient(connectionString.ServiceEndpoint, connectionString.AuthKey);
        }
    }
}
