import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UserContext } from '../providers/UserContext';

export default function Navigation() {
  const userContext = useContext(UserContext);
  const [t, i18n] = useTranslation();

  const handleLoginClick = () => {
    userContext.login();
    return false;
  }

  const { user, isAuthenticated } = userContext;

  const handleLogoutClick = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      userContext.logout();
    }
    
    return false;
  }

  const getNavigationLink = () => {
    return isAuthenticated
      ? <a href="#" onClick={handleLogoutClick}>{t('nav.hello', {account: user})}</a>
      : <a href="#" onClick={handleLoginClick}>{t('nav.signIn')}</a>;
  }

  console.log("NAVIGATION RENDERED", userContext);

  return (
    <nav className="blue darken-4" role="navigation">
      <div className="nav-wrapper container">
        <Link id="logo-container" to="/" className="brand-logo">
          <img src="/govlogo.svg" height="50" style={{ verticalAlign: "middle" }} />
            &nbsp;|&nbsp;{t('nav.header')}</Link>
        {/* <a id="logo-container" href="#" className="brand-logo"></a> */}
        <ul className="right hide-on-med-and-down">
          {isAuthenticated && <li><Link to="/heatmap">Heatmap</Link></li>}
          <li>{getNavigationLink()}</li>          
        </ul>
        <ul id="nav-mobile" className="sidenav">
          {isAuthenticated && <li><Link to="/heatmap">Heatmap</Link></li>}
          <li>{getNavigationLink()}</li>
        </ul>
        <a href="#" data-target="nav-mobile" className="sidenav-trigger"><i className="material-icons">menu</i></a>
      </div>
    </nav>
  );
}