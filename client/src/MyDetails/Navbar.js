import React from 'react';
import { history } from "./../helpers/history.js";

function AddFeedButton() {
  return (<button onClick={() => {history.push("/user/addFeed")}}>Add Feed</button>);
}

function ImportOPMLButton() {
  return (<button onClick={() => {history.push("/user/importOPML")}}>Import OPML</button>);
}

function DeleteAllFeedsButton() {
  return (<button onClick={() => {history.push("/user/deleteAllFeeds")}}>Delete all feeds</button>);
}

function MyDetailsNavbar() {
	return (
		<div className="navbar">
      <div className="navbarHeader">
        My Details
      </div>
      <div className="navbarContent">
        <div className="buttonDiv">
          <AddFeedButton />
          <ImportOPMLButton />
          <DeleteAllFeedsButton />
        </div>
      </div>
    </div>
	);
}

export default MyDetailsNavbar;