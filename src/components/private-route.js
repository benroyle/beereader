import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { authenticationService } from '../services/auth.service.js';

export const PrivateRoute = ({ children, roles, ...rest }) => (
  <Route {...rest} render={props => {
    const currentUser = authenticationService.currentUserValue;
    if ((!currentUser) || (authenticationService.isAuthorised === false)) {
      // not logged in so redirect to login page with the return url
      return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
    }
    // check if route is restricted by role
    if (roles && roles.indexOf(currentUser.role) === -1) {
      // role not authorised so redirect to login page
      return <Redirect to={{ pathname: '/login'}} />
    }

    // authorised so return component
    return children;
  }} />
);