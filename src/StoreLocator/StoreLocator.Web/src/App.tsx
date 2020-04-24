import './App.css';
import React, { useState, useEffect } from 'react';
import './i18n';
import HomePage from './components/HomePage';
import Layout from './components/Layout';
import { ExitRequestPayload } from './models/ExitRequest';
import apiClient from './services/ApiClient';
import { Route, Switch, useHistory } from 'react-router-dom';
import StoreInfo from './components/StoreInfo';
import ExitRequestValidate from './components/ExitRequestValidate';
import StoreLocatorMap from './components/StoreLocatorMap';
import NotFound from './components/NotFound';
import appInsights from './services/AppInsights';
import authProvider from './providers/authProvider';
import { UserContext, initialUserContext } from './providers/UserContext';
import config from './appConfig.json';
import { IAccountInfo, AuthenticationState } from 'react-aad-msal';
import { AuthResponse } from 'msal';

appInsights.loadAppInsights();
appInsights.trackPageView();

const account = authProvider.getAccount();
const unAuthenticated = { user: '', isAuthenticated: false };
const userContextValue = {...initialUserContext, ...unAuthenticated};

export default function App() {
  const [busy, setBusy] = useState(false);
  const [user, setUser] = useState("");

  const login = () => {
    const authPromise = authProvider.loginPopup({ scopes: [config.b2cScope] });
    handleAuthResponse(authPromise);
  }
  
  const handleAuthResponse = (promise: Promise<AuthResponse>, isSilent?: boolean) => {
    promise
      .then(authResponse => {
        userContextValue.user = authResponse.account.name;
        userContextValue.isAuthenticated = true; 
        setUser(authResponse.account.name);
      })
      .catch(reason => {
        if (isSilent === true) {
          console.log("Failed silent authentication:", reason);
          handleAuthResponse(authProvider.acquireTokenPopup({scopes: [config.b2cScope]}));
        }
        else {
          console.log("Failed silent authentication:", reason);
          M.toast({ html: `Failed authentication:: ${reason}` });
        }
      })
      .finally();
  }

  userContextValue.login = login;

  useEffect(() => {
    if (!!account) {
      const authPromise = authProvider.acquireTokenSilent({ scopes: [config.b2cScope] });
      handleAuthResponse(authPromise);
    }
    else console.log("NO ACCOUNT");
  }, [])

  const history = useHistory();
  
  const handleSubmit = (payload: ExitRequestPayload) => {
    console.log(payload);
    setBusy(true);
    
    apiClient.postExitRequest(payload)
      .then(response => { 
        console.log("Success", response);
        history.push(`/details/${response.id}`, response);
      })
      .catch(reason => {
        console.log("Error", reason);
        M.toast({ html: `Exit Request failed with reason: ${reason}` });
      })
      .finally(() => setBusy(false));
  }
   
  return (
    <UserContext.Provider value={userContextValue}>
      <Layout user={user}>
        <Switch>
          <Route exact path="/">
            <HomePage onSubmit={handleSubmit} isBusy={busy} />
          </Route>
          <Route path="/details/:id" component={StoreInfo} />
          <Route path="/validate/:id" component={ExitRequestValidate} />
          <Route path="/map" component={StoreLocatorMap} />
          <Route component={NotFound} />
        </Switch>
      </Layout>
    </UserContext.Provider>
  );
}