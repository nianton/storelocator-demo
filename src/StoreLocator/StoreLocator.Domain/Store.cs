namespace StoreLocator.Domain
{
    using System;
    using Newtonsoft.Json;

    public partial class Store
    {
        [JsonProperty("id")]
        public Guid Id { get; set; }

        [JsonProperty("posId")]
        public long PosId { get; set; }

        [JsonProperty("posType")]
        public string PosType { get; set; }

        [JsonProperty("legalName")]
        public string LegalName { get; set; }

        [JsonProperty("active")]
        public bool Active { get; set; }

        [JsonProperty("amenities")]
        public string[] Amenities { get; set; }

        [JsonProperty("address")]
        public Address Address { get; set; }

        [JsonProperty("location")]
        public GeoLocation Location { get; set; }

        [JsonProperty("subproducts")]
        public Subproduct[] Subproducts { get; set; }
    }

    public class StoreInfo
    {
        [JsonProperty("id")]
        public Guid Id { get; set; }
        [JsonProperty("coordinates")]
        public double[] Coordinates { get; set; }
        [JsonProperty("posType")]
        public string PosType { get; set; }
        [JsonProperty("address")]
        public Address Address { get; set; }
    }
}
