// authProvider.js
import { MsalAuthProvider, LoginType } from 'react-aad-msal';
import { Configuration } from 'msal';
import appConfig from '../appConfig.json';

// Msal Configurations
const config: Configuration = {
  auth: {
    authority: appConfig.authority,
    clientId: appConfig.clientId,
    validateAuthority: false,
    postLogoutRedirectUri: window.location.origin,
    redirectUri: window.location.origin        
    //redirectUri: '<OPTIONAL REDIRECT URI>'
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: true
  }
};
 
// Authentication Parameters
const authenticationParameters = {
  scopes: [ appConfig.b2cScope ]
}
 
// Options
const options = {
  loginType: LoginType.Popup,
  tokenRefreshUri: window.location.origin + '/auth.html'  
}
 
const authProvider = new MsalAuthProvider(config, authenticationParameters, options);
export default authProvider;