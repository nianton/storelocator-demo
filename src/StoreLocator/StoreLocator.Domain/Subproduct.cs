namespace StoreLocator.Domain
{
    using Newtonsoft.Json;
    using System;

    public partial class Subproduct
    {
        [JsonProperty("id")]
        public Guid Id { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("prodId")]
        public Guid ProdId { get; set; }

        [JsonProperty("productName")]
        public string ProductName { get; set; }

        [JsonProperty("sellStatus")]
        public string SellStatus { get; set; }

        [JsonProperty("luckyGrade")]
        public long LuckyGrade { get; set; }
    }
}
