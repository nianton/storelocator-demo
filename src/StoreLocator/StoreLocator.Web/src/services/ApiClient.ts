import { ExitRequestPayload, ExitRequest, ExitRequestMapInfo, ExitCountResponse } from "../models/ExitRequest";
import config from '../appConfig.json';
import authProvider from "../providers/authProvider";

export class ApiClient {
    private baseUrl: string = config.publicApiUrl;
    private baseSecureUrl: string = config.secureApiUrl;
    private apiKey: string = config.apiKey;
    private accessToken: string = "";

    /**
     * Initializes the API client instance. 
     * @param baseUrl 
     */
    constructor(baseUrl?: string) {
        if (baseUrl) {
            this.baseUrl = baseUrl;
        }
    }

    postExitRequest(requestPayload: ExitRequestPayload): Promise<ExitRequest> {
        return this.sendRequest("requestexit", "POST", requestPayload)
            .then(value => { 
                console.log(value);  
                return value.json(); 
            });
    }

    getExitRequest(id: string): Promise<ExitRequest> { 
        return this.sendRequest(`requestexit/${id}`, "GET")
          .then(value => {
              return value.json(); 
          });
    }

    getAreaExitRequests(area: string) : Promise<ExitRequest[]> {
      return this.sendSecureRequest(`getexit/${area}`, "GET")
        .then(value => {
            return value.json(); 
        });
    } 

    getExitRequestsForMap() : Promise<ExitRequestMapInfo[]> {
      return this.sendSecureRequest(`getexitmap`, "GET")
        .then(value => {
            return value.json(); 
        });
    }

    getExitCount(): Promise<ExitCountResponse> {
      return this.sendSecureRequest(`getcount`, "GET")
        .then(value => {
            return value.json(); 
        });
    }

    private sendSecureRequest(resourceUrl: string, method: string, payload?: any) {
      const url = [this.baseSecureUrl, resourceUrl].join('/');
      let requestInit = this.ensureApiKey({ method: method });

      if (!!payload && (method.toUpperCase() == "POST" || method.toUpperCase() == "PUT")) {
          requestInit.body = JSON.stringify(payload);
      }
  
      return this.ensureAuthorization(requestInit).then(ri => fetch(url, ri));      
    }

    private sendRequest(resourceUrl: string, method: string, payload?: any) {
        const url = [this.baseUrl, resourceUrl].join('/');
        var requestInit: RequestInit = this.ensureApiKey({ method: method });

        if (!!payload && (method.toUpperCase() == "POST" || method.toUpperCase() == "PUT")) {
          requestInit.body = JSON.stringify(payload);
        }        

        return fetch(url, requestInit);
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