import React from "react";
import { Router, BrowserRouter, withRouter, Route, NavLink } from "react-router-dom";
import { history } from "./helpers/history.js";
import { Role } from "./helpers/role.js";
import { authenticationService } from "./services/auth.service.js";
import { feedService } from "./services/feed.service.js";
import { PrivateRoute } from "./components/private-route.js";
import AdminContent from "./Admin/Content.js";
import AdminNavbar from "./Admin/Navbar.js";
import MyDetailsContent from "./MyDetails/Content.js";
import MyDetailsNavbar from "./MyDetails/Navbar.js";
import { LoginPage } from './Login.js';
import LogoutPage from './Logout.js';
import Navbar from './Navbar.js';
import Content from './Content.js';
import './assets/stylesheet.css';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: null,
      isAdmin: false,
      feedList: [],
      feed: ''
    };
  }

  getGreeting() {
    if (this.state.currentUser) {
      return (<div className="greeting">Hello&nbsp;<strong>{this.state.currentUser.username}</strong>!</div>);
    } else {
      return (<div className="greeting">&nbsp;</div>);
    }
  }

  componentDidMount() {
    authenticationService.currentUser.subscribe(x =>
      this.setState({
        currentUser: x,
        isAdmin: x && x.role === Role.Admin
      })
    );
    feedService.feedList.subscribe(x =>
      this.setState({
        feedList: x
      })
    );
    feedService.feed.subscribe(x =>
      this.setState({
        feed: x
      })
    );
  }

  logout() {
    authenticationService.logout();
    history.push("/login");
  }

  async componentDidUpdate(prevProps, prevState) {
    if ((this.state.currentUser) && (prevState.currentUser !== this.state.currentUser)) {
      this.setState({feedList: [], feed: ''});
      authenticationService.isAuthenticated = true;
      await feedService.getFeeds(this.state.currentUser.id);
    }
  }

  render() {
    const {currentUser, isAdmin, feedList, feed} = this.state;
    return (
      <Router history={history}>
        <div className="App">
          <div className="navColumn">
            <div className="title">
              <div className="titleContainer">
                <div className="titleFont black">B</div>
                <div className="titleFont yellow">e</div>
                <div className="titleFont black">e</div>
                <div className="titleFont yellow">&nbsp;</div>
                <div className="titleFont black">R</div>
                <div className="titleFont yellow">e</div>
                <div className="titleFont black">a</div>
                <div className="titleFont yellow">d</div>
                <div className="titleFont black">e</div>
                <div className="titleFont yellow">r</div>
              </div>
            </div>
            <PrivateRoute exact path="/">
              <Navbar feedList={feedList} />
            </PrivateRoute>
            <PrivateRoute path="/admin">
              <AdminNavbar />
            </PrivateRoute>
            <PrivateRoute path="/user">
              <MyDetailsNavbar />
            </PrivateRoute>
          </div>
          <div className="contentColumn">
            {this.getGreeting()}
            <nav>
              <div className="links">
                <NavLink exact to="/">Home</NavLink>
                {isAdmin && (
                  <NavLink to="/admin">Admin</NavLink>
                )}
                {authenticationService.isAuthenticated && (
                  <NavLink to="/user">My Details</NavLink>
                )}
                {authenticationService.isAuthenticated && (
                  <NavLink to="/logout">Logout</NavLink>
                )}
              </div>
            </nav>
            <PrivateRoute exact path="/">
              <Content feed={feed} />
            </PrivateRoute>
            <PrivateRoute path="/user">
              <MyDetailsContent currentUser={currentUser} history={history}/>
            </PrivateRoute>
            <PrivateRoute path="/admin" roles={[Role.Admin]}>
              <AdminContent />
            </PrivateRoute>
            <Route path="/logout">
              <LogoutPage/>
            </Route>
            <Route path="/login">
              <LoginPage history={history}/>
            </Route>
          </div>
        </div>
      </Router>
    );
  }
}

const AppWithRouter = withRouter(App);

const AppContainer = () => {
  return (
    <BrowserRouter>
      <AppWithRouter />
    </BrowserRouter>
  );
};

export default AppContainer;
