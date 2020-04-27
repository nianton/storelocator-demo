import { PosTypeStoreCount, Store } from "../models/Store";
import StoreInfo from "../models/StoreInfo";
import config from '../appConfig.json';
import authProvider from "../providers/authProvider";

export class ApiClient {
    private baseUrl: string = config.apiBaseUrl;
    private apiKey: string = config.apiKey;

    /**
     * Initializes the API client instance. 
     * @param baseUrl 
     */
    constructor(baseUrl?: string) {
        if (baseUrl) {
            this.baseUrl = baseUrl;
        }
    }

    getStore(posType: string, id: string): Promise<Store> {
      return this.sendRequest(`stores/${posType}/${id}`, "GET")
        .then(value => {
            return value.json(); 
        });
    }

    getStoreInfos(): Promise<StoreInfo[]> {
      return this.sendRequest("stores", "GET")
        .then(value => {
            return value.json(); 
        });
    }

    getPosTypeCounts(): Promise<PosTypeStoreCount[]> {
      return this.sendRequest("stores/counts", "GET")
        .then(value => {
            return value.json(); 
        });
    }

    private sendSecureRequest(resourceUrl: string, method: string, payload?: any) {
      const url = [this.baseUrl, resourceUrl].join('/');
      const requestInit = this.prepareRequest(url, method, payload);

      return this.ensureAuthorization(requestInit).then(ri => fetch(url, ri));      
    }

    private sendRequest(resourceUrl: string, method: string, payload?: any) {
      const url = [this.baseUrl, resourceUrl].join('/');
      const requestInit = this.prepareRequest(url, method, payload);
      return fetch(url, requestInit);
    }

    private prepareRequest(url: string, method: string, payload?: any) : RequestInit {
      var requestInit: RequestInit = this.ensureApiKey({ method: method });

      if (!!payload && (method.toUpperCase() == "POST" || method.toUpperCase() == "PUT")) {
        requestInit.body = JSON.stringify(payload);
      }

      return requestInit;
    }

    private ensureApiKey(requestInit: RequestInit): RequestInit {
      if (!!this.apiKey) {
        const apiHeader = { "Ocp-Apim-Subscription-Key": this.apiKey }
        requestInit.headers = { ...(requestInit.headers || {}), ...apiHeader };
      }

      return requestInit;
    }

    private ensureAuthorization(requestInit: RequestInit) {
      var authPromise = authProvider.getAccessToken({ scopes: [config.b2cScope] })
        .then(accessTokenResponse => {
          console.log('accessTokenAquired:', accessTokenResponse);
          const authHeader = { "Authorization": `Bearer ${accessTokenResponse.accessToken}` }
          requestInit.headers = { ...(requestInit.headers || {}), ...authHeader };  
          return requestInit;
        });

      authPromise.catch(reason => console.error("Could not get an access token", reason));
      return authPromise;
    }
}

var apiClient = new ApiClient();
export default apiClient;