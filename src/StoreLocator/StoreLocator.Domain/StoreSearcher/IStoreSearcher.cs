using System.Threading.Tasks;

namespace StoreLocator.Domain
{
    public interface IStoreSearcher
    {
        Task<StoreQueryResponse> SearchAsync(StoreQueryRequest query);

        Task<Store> GetStoreAsync(int storeId);
    }
}
