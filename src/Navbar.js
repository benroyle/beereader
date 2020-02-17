import React from 'react';
import { authenticationService } from "./services/auth.service.js";
import { feedService } from "./services/feed.service.js";

class Navbar extends React.Component {
  opener(feed) {
    feedService.setRandom(false);
    feedService.selectFeed(feed);
  }

  randomOpener() {
    feedService.setRandom(true);
    feedService.getFeeds(authenticationService.currentUserValue.id, true);
  }

	getFeeds() {
    if (this.props.feedList.length > 0) {
      const feedlinks = this.props.feedList.map((feed, index) => {
        if ((feedService.feedValue !== null) && (feed.id !== feedService.feedValue.id)) {
          return (<div className="buttonDiv" key={index}><button className="feed" onClick={this.opener.bind(this,feed)}>{feed.sitename}</button></div>);
        } else {
          return (<div className="buttonDiv" key={index}><button className="feed active" onClick={this.opener.bind(this,feed)}>{feed.sitename}</button></div>);
        }        
      });
      return feedlinks;
    } else {
      return (<div className="buttonDiv"><p>No feeds yet! Go to the My Details page and add some.</p></div>);
    }
  }

  randomButton() {
    if (this.props.feedList.length > 0) {
      return (<div className="buttonDiv random"><button className="random" onClick={this.randomOpener.bind(this)}>Random</button></div>);
    }
  }

	render() {
		return (
			<div className="navbar">
        <div className="navbarHeader">
          Feeds
        </div>
        <div className="navbarContent">
          {this.getFeeds()}
          {this.randomButton()}
        </div>
      </div>
		)
	}
}

export default Navbar;