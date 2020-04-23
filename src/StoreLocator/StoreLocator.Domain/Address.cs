namespace StoreLocator.Domain
{
    using Newtonsoft.Json;

    public partial class Address
    {
        [JsonProperty("city")]
        public string City { get; set; }

        [JsonProperty("address")]
        public string AddressAddress { get; set; }

        [JsonProperty("postalCode")]
        public long PostalCode { get; set; }
    }
}
