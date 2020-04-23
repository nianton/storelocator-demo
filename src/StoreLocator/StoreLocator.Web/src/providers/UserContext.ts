import React from 'react';
import authProvider from './authProvider';
import appConfig from '../appConfig.json';
import { AuthResponse, Account } from 'msal';

export interface UserContextType {
  user: string;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  account: Account;
}

export const initialUserContext: UserContextType = { 
  user: "n/a",
  isAuthenticated: false,
  login: () => authProvider.loginPopup({ scopes: [appConfig.b2cScope] }),
  logout: () => authProvider.logout(),
  account: authProvider.getAccount()  
};

export const UserContext = React.createContext(initialUserContext);