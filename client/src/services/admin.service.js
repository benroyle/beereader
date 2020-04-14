import axios from 'axios';

export const adminService = {
  getUsers,
  getUser,
  editUser,
  deleteUser,
  addUser
};

async function getUsers() {
  const config = {
    headers: {
      'content-type': 'application/json; charset=utf-8'
    }
  }
  const userItems = await axios.get('http://localhost:4000/beereader/adminGetUsers/', config)
  .then((response) => (response.data))
  .then((response) => {
    if (response !== undefined) {
      return response;
    } else {
      return false;
    }
  });
  if (userItems !== undefined) {
    return userItems;
  }
}

async function getUser(id) {
  const config = {
    headers: {
      'content-type': 'application/json; charset=utf-8'
    }
  }
  const userItems = await axios.post('http://localhost:4000/beereader/adminGetUser/', { 'id': id }, config)
  .then((response) => (response.data))
  .then((response) => {
    if (response !== undefined) {
      return response;
    } else {
      return false;
    }
  });
  if (userItems !== undefined) {
    return userItems;
  }
}

async function editUser(id, username, password, role) {
  const config = {
    headers: {
      'content-type': 'application/json; charset=utf-8'
    }
  }
  const userEdit = await axios.post('http://localhost:4000/beereader/adminEditUser/', { 'id': id, 'username': username, 'password': password, 'role': role }, config)
  .then((response) => (response.data))
  .then((response) => {
    if (response !== undefined) {
      return response;
    } else {
      return false;
    }
  });
  if (userEdit !== undefined) {
    return userEdit;
  }
}

async function deleteUser(id) {
  const config = {
    headers: {
      'content-type': 'application/json; charset=utf-8'
    }
  }
  const userDelete = await axios.post('http://localhost:4000/beereader/adminDeleteUser/', { 'id': id }, config)
  .then((response) => (response.data))
  .then((response) => {
    if (response !== undefined) {
      return response;
    } else {
      return false;
    }
  });
  if (userDelete !== undefined) {
    return userDelete;
  }
}

async function addUser(username, password, role) {
  const config = {
    headers: {
      'content-type': 'application/json; charset=utf-8'
    }
  }
  const userAdd = await axios.post('http://localhost:4000/beereader/adminAddUser/', { 'username': username, 'password': password, 'role': role }, config)
  .then((response) => (response.data))
  .then((response) => {
    if (response !== undefined) {
      return response;
    } else {
      return false;
    }
  });
  if (userAdd !== undefined) {
    return userAdd;
  }
}
