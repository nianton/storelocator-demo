import config from '../appConfig.json';
import * as Msal from 'msal';


export class AuthService {
  private msalConfig: Msal.Configuration = {
    auth: {
      clientId: config.clientId,
      authority: config.authority,
      validateAuthority: false
    },
    cache: {
      cacheLocation: "localStorage",
      storeAuthStateInCookie: true
    }
  };

  private clientApp = new Msal.UserAgentApplication(this.msalConfig);

  isAuthenticated() {
    return this.clientApp.getAccount() != null;
  }

  getAccount() {
    return this.clientApp.getAccount().userName;
  }

  login() {
    const authParams = { scopes: [config.b2cScope] };
    this.clientApp.loginPopup(authParams)
      .then(authResponse => { 
        console.log(authResponse); 
        this.clientApp.acquireTokenSilent(authParams)
          .then(authResponse2 => console.log(authResponse2));
      }); 
  }
}

const Auth = new AuthService();
export default Auth;