namespace StoreLocator.Domain
{
    using Newtonsoft.Json;
    using System.Collections.Generic;

    public class Address
    {
        [JsonProperty("street")]
        public string Street { get; set; }
        [JsonProperty("number")]
        public string Number { get; set; }
        [JsonProperty("area")]
        public string Area { get; set; }
        [JsonProperty("postCode")]
        public string PostCode { get; set; }
    }
}
