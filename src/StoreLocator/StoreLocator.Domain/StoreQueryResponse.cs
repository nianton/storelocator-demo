using System.Collections.Generic;

namespace StoreLocator.Domain
{
    public class StoreQueryResponse
    {
        public long TotalCount { get; set; }
        public List<Store> Results { get; set; }
    }
}
