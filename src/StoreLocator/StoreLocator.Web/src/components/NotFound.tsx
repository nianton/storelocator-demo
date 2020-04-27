import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
      <div className="container">
        <div className="section no-pad-bot" id="index-banner">
          <h1 className="header center">Page not found</h1>
          <div className="row center">
            <h5 className="header col s12 light">---</h5>
          </div>
          <div className="row">
            <div className="col s12">Return to <Link to="/">home</Link>.</div>
          </div>
        </div>
      </div>
    );
}