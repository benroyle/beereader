import React from 'react';
import { history } from "./../helpers/history.js";

function AddUserButton() {
  return (<button onClick={() => {history.push("/admin/addUser")}}>Add User</button>);
}

function AdminNavbar() {
	return (
		<div className="navbar">
      <div className="navbarHeader">
        Admin
      </div>
      <div className="navbarContent">
        <div className="buttonDiv">
          <AddUserButton />
        </div>
      </div>
    </div>
	);
}

export default AdminNavbar;