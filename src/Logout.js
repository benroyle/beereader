import React from 'react';
import { authenticationService } from './services/auth.service.js';

class LogoutPage extends React.Component {

  componentDidMount() {
    authenticationService.logout();
  }

  render() {
    return (
      <div className="modalDiv">
        <h1>Logout</h1>
        <p>You have been logged out! Please click <a href="/login">here</a> to log back in.</p>
      </div>
    );  
  };
}

export default LogoutPage; 