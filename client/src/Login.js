import React from 'react';
import { authenticationService } from './services/auth.service.js';

class LoginPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      errorMsg: ''
    }
    // redirect to home if already logged in
    if (authenticationService.currentUserValue) {
      this.props.history.push('/');
    }

    this.changeUname = this.changeUname.bind(this);
    this.changePword = this.changePword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  changeUname(event) {
    this.setState({username: event.target.value});
  }

  changePword(event) {
    this.setState({password: event.target.value});
  }

  async handleSubmit(event) {
    this.setState({errorMsg: ''});
    event.preventDefault();
    if ((this.state.username !== '') && (this.state.password !== '')) {
      await authenticationService.login(this.state.username, this.state.password)
      .then((response) => {
        if (response !== false) {
          this.props.history.push("/");
        } else {
          this.setState({errorMsg: "Username and /or password fields are incorrect. Please try again."});
        }
      },
      error => {
        console.error(error);
      });
    } else {
      if ((this.state.username === '') && (this.state.password === '')) {
        this.setState({errorMsg: "Username and password fields are empty. Please complete the form and try again."});
      } else {
        if (this.state.username === '') {
          this.setState({errorMsg: "Username field is empty. Please complete the form and try again."});
        } else {
          this.setState({errorMsg: "Password field is empty. Please complete the form and try again."});
        }
      }
    }
  }

  render() {
    return (
      <div className="modalDiv">
        <h1>Login</h1>
        <form onSubmit={this.handleSubmit}>
          <div className="left">
            Username:
          </div>
          <div className="right">
            <input type="text" name="username" id="username" placeholder="username" value={this.state.username} onChange={this.changeUname} />
          </div>
          <div className="left">
            Password:
          </div>
          <div className="right">
            <input type="password" name="password" id="password" placeholder="password" value={this.state.password} onChange={this.changePword} />
          </div>
          <div className="left">
            &nbsp;
          </div>
          <div className="right">
            <button type="submit">Log in</button>
          </div>
          <div className="left">
            &nbsp;
          </div>
          <div className="right errorMsg">
          {this.state.errorMsg}
          </div>
        </form>
      </div>
    );  
  };
}

export { LoginPage }; 