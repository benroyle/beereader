import React, { useState, useEffect } from 'react';
import { Switch, Link, useRouteMatch } from "react-router-dom";
import { history } from "./../helpers/history.js";
import { PrivateRoute } from "./../components/private-route.js";
import { adminService } from './../services/admin.service.js';

function UserActions(props) {
  const userlinks = props.users.map((user, index) => 
    <div className="admin" key={index}>
      <div className="adminName">{user.username}</div>
      <div className="adminAction">{user.role}</div>
      <div className="adminAction">
        <Link to={`${props.url}/editUser/` + user.id}>Edit</Link>
      </div>
      <div className="adminAction">
        <Link to={`${props.url}/deleteUser/` + user.id}>Delete</Link>
      </div>
    </div>
  );
  return userlinks;
}



function NotFound() {
  return (<p>No users yet, which is a nice paradox to have.</p>)
}

function AdminContent(props) {
  let { path, url } = useRouteMatch();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    let mounted = true;
    adminService.getUsers()
    .then((response) => {
      if (mounted) {
        setUsers(response);
      }
    });
    return () => {mounted = false};
  }, [users]);

  return (
    <div className="contentDiv">
      <div className="formContainer">
        <Switch>
          <PrivateRoute exact path={path}>
            <h2>Users, innit</h2>
            {(users !== undefined) ? <UserActions url={url} users={users} /> : <NotFound/>}
          </PrivateRoute>
          <PrivateRoute path={`${path}/EditUser/:userId`}>
            <EditUser url={url} users={users} history={history} />
          </PrivateRoute>
          <PrivateRoute path={`${path}/DeleteUser/:userId`}>
            <DeleteUser url={url} users={users} history={history} />
          </PrivateRoute>
          <PrivateRoute path={`${path}/AddUser`}>
            <AddUser url={url} users={users} history={history} />
          </PrivateRoute>
        </Switch>
      </div>
    </div>
  );
}

class AddUser extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      role: 'User',
      errorMsg: ''
    }

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.backButton = this.backButton.bind(this);
  }

  async handleSubmit(event) {
    this.setState({errorMsg: ''});
    event.preventDefault();
    if ((this.state.username !== '') && (this.state.password !== '')) {
      await adminService.addUser(this.state.username, this.state.password, this.state.role)
      .then((response) => {
        if (response !== false) {
          const newUsers = adminService.getUsers();
          if (newUsers !== undefined) {
            this.props.history.push("/admin");
          }
        } else {
          this.setState({errorMsg: "There was a problem with this transaction. Please try again."});
        }
      },
      error => {
        console.error(error);
      });
    } else {
      if ((this.state.username === '') && (this.state.password === '')) {
        this.setState({errorMsg: "Username and Password fields are empty. Please complete the form and try again."});
      } else {
        if (this.state.username === '') {
          this.setState({errorMsg: "Username field is empty. Please complete the form and try again."});
        } else {
          this.setState({errorMsg: "Password field is empty. Please complete the form and try again."});
        }
      }
    }
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  backButton(event) {
    event.preventDefault();
    this.props.history.push("/admin");
  }

  render() {
    return (
      <div>
        <h2>Add User</h2>
        <form onSubmit={this.handleSubmit}>
          <div className="left">
            Username:
          </div>
          <div className="right">
            <input type="text" name="username" id="username" placeholder="username" value={this.state.username} onChange={this.handleInputChange} />
          </div>
          <div className="left">
            Password:
          </div>
          <div className="right">
            <input type="password" name="password" id="password" placeholder="password" value={this.state.password} onChange={this.handleInputChange} />
          </div>
          <div className="left">
            Role:
          </div>
          <div className="right">
            <select name="role" id="role" value={this.state.role} onChange={this.handleInputChange}>
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div className="left">
            &nbsp;
          </div>
          <div className="right">
            <button type="submit" className="submitButton">Save user</button>
            <button type="reset" className="cancelButton" onClick={this.backButton}>Cancel</button>
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
  }
}

class DeleteUser extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: '',
      username: '',
      role: '',
      errorMsg: ''
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.backButton = this.backButton.bind(this);
  }

  async handleSubmit(event) {
    this.setState({errorMsg: ''});
    event.preventDefault();
    if ((this.state.username !== '') && (this.state.role !== '')) {
      await adminService.deleteUser(this.state.id)
      .then((response) => {
        if (response !== false) {
          const newUsers = adminService.getUsers();
          if (newUsers !== undefined) {
            this.props.history.push("/admin");
          }
        } else {
          this.setState({errorMsg: "There was a problem with this transaction. Please go back and try again."});
        }
      },
      error => {
        console.error(error);
      });
    } else {
      this.setState({errorMsg: "There was a problem with this transaction. Please go back and try again."});
    }
  }

  backButton(event) {
    event.preventDefault();
    this.props.history.push("/admin");
  }

  componentDidMount() {
    const qString = /(?:\/admin\/deleteUser\/)(.*)/;
    const tmpId = qString.exec(this.props.history.location.pathname);
    const userId = Number(tmpId[1]);
    const users = this.props.users;
    let user = null;
    for (let i = 0; i < users.length; i++) {
      if (users[i].id === userId) {
        user = users[i];
      }
    }
    if (user !== null) {
      this.setState({username: user.username, role: user.role, id: user.id});
    }
  }

  render() {
    return (
      <div>
        <h2>Delete User</h2>
        <form onSubmit={this.handleSubmit}>
          <div className="left">
            Username:
          </div>
          <div className="right">
            {this.state.username}
          </div>
          <div className="left">
            Role:
          </div>
          <div className="right">
            {this.state.role}
          </div>
          <div className="left">
            &nbsp;
          </div>
          <div className="right">
            <button type="submit" className="submitButton">Delete this user</button>
            <button type="reset" className="cancelButton" onClick={this.backButton}>Cancel</button>
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
  }
}

class EditUser extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: '',
      username: '',
      password: '',
      role: '',
      errorMsg: ''
    }

    this.changeUname = this.changeUname.bind(this);
    this.changePword = this.changePword.bind(this);
    this.changeRole = this.changeRole.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.backButton = this.backButton.bind(this);
  }

  async handleSubmit(event) {
    this.setState({errorMsg: ''});
    event.preventDefault();
    if ((this.state.username !== '') && (this.state.password !== '')) {
      await adminService.editUser(this.state.id, this.state.username, this.state.password, this.state.role)
      .then((response) => {
        if (response !== false) {
          const newUsers = adminService.getUsers();
          if (newUsers !== undefined) {
            this.props.history.push("/admin");
          }
        } else {
          this.setState({errorMsg: "There was a problem with this transaction. Please try again."});
        }
      },
      error => {
        console.error(error);
      });
    } else {
      if ((this.state.username === '') && (this.state.password === '')) {
        this.setState({errorMsg: "Username and Password fields are empty. Please complete the form and try again."});
      } else {
        if (this.state.username === '') {
          this.setState({errorMsg: "Username field is empty. Please complete the form and try again."});
        } else {
          this.setState({errorMsg: "Password field is empty. Please complete the form and try again."});
        }
      }
    }
  }

  changeUname(event) {
    this.setState({username: event.target.value});
  }

  changePword(event) {
    this.setState({password: event.target.value});
  }

  changeRole(event) {
    this.setState({role: event.target.value});
  }

  backButton(event) {
    event.preventDefault();
    this.props.history.push("/admin");
  }

  async componentDidMount() {
    const qString = /(?:\/admin\/editUser\/)(.*)/;
    const tmpId = qString.exec(this.props.history.location.pathname);
    const userId = Number(tmpId[1]);
    const users = this.props.users;
    let user = null;
    for (let i = 0; i < users.length; i++) {
      if (users[i].id === userId) {
        user = users[i];
      }
    }
    if (user !== null) {
      let fullUser = await adminService.getUser(user.id);
      if (fullUser !== undefined) {
        this.setState({username: fullUser[0].username, password: fullUser[0].password, role: fullUser[0].role, id: fullUser[0].id});
      }
    }
  }

  render() {
    return (
      <div>
        <h2>Edit User</h2>
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
            Role:
          </div>
          <div className="right">
            <select name="role" id="role" value={this.state.role} onChange={this.changeRole}>
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div className="left">
            &nbsp;
          </div>
          <div className="right">
            <button type="submit" className="submitButton">Save changes</button>
            <button type="reset" className="cancelButton" onClick={this.backButton}>Cancel</button>
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
  }
}

export default AdminContent;
