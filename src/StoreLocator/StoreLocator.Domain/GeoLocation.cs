using Newtonsoft.Json;

namespace StoreLocator.Domain
{
    public partial class GeoLocation
    {
        [JsonProperty("type")]
        public string Type { get; set; }

        [JsonProperty("coordinates")]
        public double[] Coordinates { get; set; }
    }
}
