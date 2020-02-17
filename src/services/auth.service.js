import { BehaviorSubject } from 'rxjs';
import axios from 'axios';

const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));

export const authenticationService = {
  login,
  logout,
  currentUser: currentUserSubject.asObservable(),
  isAuthenticated: false,
  get currentUserValue () { return currentUserSubject.value }
};

async function login(username, password) {
  const config = {
    headers: {
      'content-type': 'application/json; charset=utf-8'
    }
  }
  const checkAuth = await axios.post('http://localhost:3001/beereader/checkAuth', { 'username': username, 'password': password }, config)
  .then((response) => (response.data[0]))
  .then((user) => {
    if (user !== undefined) {
      authenticationService.isAuthenticated = true;
      localStorage.setItem('currentUser', JSON.stringify(user));
      currentUserSubject.next(user);
      return user;
    } else {
      authenticationService.isAuthenticated = false;
      return authenticationService.isAuthenticated;
    }
  });
  if (checkAuth !== undefined) {
    return checkAuth;
  }
}

function logout() {
  // remove user from local storage to log user out
  localStorage.removeItem('currentUser');
  localStorage.clear();
  currentUserSubject.next(null);
  authenticationService.isAuthenticated = false;
}