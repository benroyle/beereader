import React, { useState, useEffect } from 'react';
import { Switch, useRouteMatch } from "react-router-dom";
import { history } from "./../helpers/history.js";
import { authenticationService } from "./../services/auth.service.js";
import { feedService } from './../services/feed.service.js';
import { PrivateRoute } from "./../components/private-route.js";

function FeedOptions(props) {
  const optionTags = props.feeds.map((feed, index) => 
    <option key={index} value={feed.id}>{feed.sitename}</option>
  );
  return optionTags;
}

function NotFound() {
  return (<p>No feeds yet.</p>);
}

function buttonClicked(action) {
  const feedId = document.querySelector("select#feedSelecter").value;
  history.push("/user/" + action + "/" + feedId);
}

function MyDetailsContent(props) {
  let { path, url } = useRouteMatch();
  const [feeds, setFeeds] = useState('');

  useEffect(() => {
    const subs = [];
    subs.push(feedService.feedList.subscribe(x =>
      setFeeds(x)
    ));
    return function cleanup() {
      for (var i in subs) {
        subs[i].unsubscribe();
      }
    }
  }, [feeds]);

  return (
    <div className="contentDiv">
      <Switch>
        <PrivateRoute exact path={path}>
          <div className="formContainer">
            <h2>Feeds, innit</h2>
            {(feeds.length > 0) &&
              <form>
                <div className="left">
                  Feed:
                </div>
                <div className="right">
                  <select name="feedSelecter" id="feedSelecter">
                    <FeedOptions feeds={feeds} />
                  </select>
                </div>
                <div className="left">
                  &nbsp;
                </div>
                <div className="right">
                  <button onClick={() => buttonClicked("editFeed")}>Edit feed</button>
                  <button onClick={() => buttonClicked("deleteFeed")}>Delete feed</button>
                </div>
              </form>
            }
            {((!feeds.length) || (feeds.length === 0)) &&
              <NotFound />
            }
          </div>
        </PrivateRoute>
        <PrivateRoute path={`${path}/EditFeed/:feedId`}>
          <EditFeed url={url} feeds={feeds} history={history} />
        </PrivateRoute>
        <PrivateRoute path={`${path}/DeleteFeed/:feedId`}>
          <DeleteFeed url={url} feeds={feeds} history={history} />
        </PrivateRoute>
        <PrivateRoute path={`${path}/deleteAllFeeds`}>
          <DeleteAllFeeds url={url} feeds={feeds} history={history} />
        </PrivateRoute>
        <PrivateRoute path={`${path}/addFeed`}>
          <AddFeed url={url} feeds={feeds} history={history} />
        </PrivateRoute>
        <PrivateRoute path={`${path}/importOPML`}>
          <ImportOPML url={url} feeds={feeds} history={history} />
        </PrivateRoute>
      </Switch>
    </div>
  );
}

class AddFeed extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sitename: '',
      siteurl: '',
      errorMsg: ''
    }

    this.changeSname = this.changeSname.bind(this);
    this.changeSurl = this.changeSurl.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.backButton = this.backButton.bind(this);
  }

  async handleSubmit(event) {
    this.setState({errorMsg: ''});
    event.preventDefault();
    if ((this.state.sitename !== '') && (this.state.siteurl !== '')) {
      await feedService.addFeed(this.state.sitename, this.state.siteurl, authenticationService.currentUserValue.id)
      .then((response) => {
        if (response !== false) {
          feedService.getFeeds(authenticationService.currentUserValue.id);
          this.props.history.push("/user");
        } else {
          this.setState({errorMsg: "There was a problem with this transaction. Please try again."});
        }
      },
      error => {
        console.error(error);
      });
    } else {
      if ((this.state.sitename === '') && (this.state.siteurl === '')) {
        this.setState({errorMsg: "Site name and Feed URL fields are empty. Please complete the form and try again."});
      } else {
        if (this.state.sitename === '') {
          this.setState({errorMsg: "Site name field is empty. Please complete the form and try again."});
        } else {
          this.setState({errorMsg: "Feed URL field is empty. Please complete the form and try again."});
        }
      }
    }
  }

  changeSname(event) {
    this.setState({sitename: event.target.value});
  }

  changeSurl(event) {
    this.setState({siteurl: event.target.value});
  }

  backButton(event) {
    event.preventDefault();
    this.props.history.push("/user");
  }

  render() {
    return (
      <div className="formContainer">
        <h2>Add Feed</h2>
        <form onSubmit={this.handleSubmit}>
          <div className="left">
            Site name:
          </div>
          <div className="right">
            <input type="text" name="sitename" id="sitename" placeholder="site name" value={this.state.sitename} onChange={this.changeSname} />
          </div>
          <div className="left">
            Feed URL:
          </div>
          <div className="right">
            <input type="text" name="siteurl" id="siteurl" placeholder="feed url" value={this.state.siteurl} onChange={this.changeSurl} />
          </div>
          <div className="left">
            &nbsp;
          </div>
          <div className="right">
            <button type="submit" className="submitButton">Save feed</button>
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

class DeleteFeed extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sitename: '',
      siteurl: '',
      id: '',
      errorMsg: ''
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.backButton = this.backButton.bind(this);
  }

  async handleSubmit(event) {
    this.setState({errorMsg: ''});
    event.preventDefault();
    if ((this.state.sitename !== '') && (this.state.siteurl !== '')) {
      await feedService.deleteFeed(this.state.id)
      .then((response) => {
        if (response !== false) {
          feedService.getFeeds(authenticationService.currentUserValue.id);
          this.props.history.push("/user");
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
    this.props.history.push("/user");
  }

  componentDidMount() {
    const qString = /(?:\/user\/deleteFeed\/)(.*)/;
    const tmpId = qString.exec(this.props.history.location.pathname);
    const feedId = Number(tmpId[1]);
    const feeds = this.props.feeds;
    let feed = null;
    for (let i = 0; i < feeds.length; i++) {
      if (feeds[i].id === feedId) {
        feed = feeds[i];
      }
    }
    if (feed !== null) {
      this.setState({sitename: feed.sitename, siteurl: feed.siteurl, id: feed.id});
    }
  }

  render() {
    return (
      <div className="formContainer">
        <h2>Delete Feed</h2>
        <form onSubmit={this.handleSubmit}>
          <div className="left">
            Site name:
          </div>
          <div className="right">
            {this.state.sitename}
          </div>
          <div className="left">
            Feed URL:
          </div>
          <div className="right">
            {this.state.siteurl}
          </div>
          <div className="left">
            &nbsp;
          </div>
          <div className="right">
            <button type="submit" className="submitButton">Delete this feed</button>
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

class EditFeed extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sitename: '',
      siteurl: '',
      id: '',
      errorMsg: ''
    }

    this.changeSname = this.changeSname.bind(this);
    this.changeSurl = this.changeSurl.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.backButton = this.backButton.bind(this);
  }

  async handleSubmit(event) {
    this.setState({errorMsg: ''});
    event.preventDefault();
    if ((this.state.sitename !== '') && (this.state.siteurl !== '')) {
      await feedService.editFeed(this.state.id, this.state.sitename, this.state.siteurl)
      .then((response) => {
        if (response !== false) {
          feedService.getFeeds(authenticationService.currentUserValue.id);
          this.props.history.push("/user");
        } else {
          this.setState({errorMsg: "There was a problem with this transaction. Please try again."});
        }
      },
      error => {
        console.error(error);
      });
    } else {
      if ((this.state.sitename === '') && (this.state.siteurl === '')) {
        this.setState({errorMsg: "Site name and Feed URL fields are empty. Please complete the form and try again."});
      } else {
        if (this.state.sitename === '') {
          this.setState({errorMsg: "Site name field is empty. Please complete the form and try again."});
        } else {
          this.setState({errorMsg: "Feed URL field is empty. Please complete the form and try again."});
        }
      }
    }
  }

  changeSname(event) {
    this.setState({sitename: event.target.value});
  }

  changeSurl(event) {
    this.setState({siteurl: event.target.value});
  }

  backButton(event) {
    event.preventDefault();
    this.props.history.push("/user");
  }

  componentDidMount() {
    const qString = /(?:\/user\/editFeed\/)(.*)/;
    const tmpId = qString.exec(this.props.history.location.pathname);
    const feedId = Number(tmpId[1]);
    //const feeds = this.props.feeds;
    const feeds = feedService.feedListValue;
    let feed = null;
    for (let i = 0; i < feeds.length; i++) {
      if (feeds[i].id === feedId) {
        feed = feeds[i];
      }
    }
    if (feed !== null) {
      this.setState({sitename: feed.sitename, siteurl: feed.siteurl, id: feed.id});
    }
  }

  render() {
    return (
      <div className="formContainer">
        <h2>Edit Feed</h2>
        <form onSubmit={this.handleSubmit}>
          <div className="left">
            Site name:
          </div>
          <div className="right">
            <input type="text" name="sitename" id="sitename" placeholder="site name" value={this.state.sitename} onChange={this.changeSname} />
          </div>
          <div className="left">
            Feed URL:
          </div>
          <div className="right">
            <input type="text" name="siteurl" id="siteurl" placeholder="feed url" value={this.state.siteurl} onChange={this.changeSurl} />
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

class ImportOPML extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      file: '',
      fileCount: 0,
      feeds: [],
      errorMsg: ''
    }

    this.changeFile = this.changeFile.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.backButton = this.backButton.bind(this);
  }

  async handleSubmit(event) {
    this.setState({errorMsg: ''});
    event.preventDefault();
    if (this.state.file !== '') {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(this.state.file,"text/xml");
      const nodes = xmlDoc.getElementsByTagName("outline");
      for (var i = 0; i < nodes.length; i++) {
        console.log(nodes[i].outerHTML);
      }
      this.rssProcessor(nodes);
    } else {
      this.setState({errorMsg: "Site name and Feed URL fields are empty. Please complete the form and try again."});
    }
  }

  rssProcessor(node) {
    if (node.length !== undefined) {
      for (let i = 0; i < node.length; i++) {
        this.rssFinder(node[i]);
      }
    } else {
      this.rssFinder(node);
    }
  }

  rssFinder(node) {
    if (node.getAttribute("type") === "rss") {
      let newFeedObj = { sitename: node.getAttribute("title"), siteurl: node.getAttribute("xmlUrl") };
      this.setState(prevState => ({
        feeds: [...prevState.feeds, newFeedObj]
      }));
    }
  }

  changeFile(event) {
    let obj = this;
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onloadend = function() {
      let opmlFile = reader.result;
      obj.setState({file: opmlFile});
    }
  }

  backButton(event) {
    event.preventDefault();
    this.props.history.push("/user");
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.feeds !== prevState.feeds) {
      console.log(this.state.feeds);
      this.state.feeds.map((feed, index) => 
        feedService.addFeed(feed.sitename, feed.siteurl, authenticationService.currentUserValue.id)
        .then((response) => {
          if (response !== false) {
            feedService.getFeeds(authenticationService.currentUserValue.id);
            this.props.history.push("/user");
          } else {
            this.setState({errorMsg: "There was a problem with this transaction. Please try again."});
          }
        })
      );
    }
  }

  render() {
    return (
      <div className="formContainer">
        <h2>Import OPML</h2>
        <form onSubmit={this.handleSubmit}>
          <div className="left">
            OPML File:
          </div>
          <div className="right">
            <input type="file" name="file" id="file" className="fileBrowser" multiple={false} onChange={this.changeFile} />
          </div>
          <div className="right">
            <button type="submit" className="submitButton">Import feeds</button>
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

class DeleteAllFeeds extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      errorMsg: ''
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.backButton = this.backButton.bind(this);
  }

  async handleSubmit(event) {
    this.setState({errorMsg: ''});
    event.preventDefault();
    await feedService.deleteAllFeeds(authenticationService.currentUserValue.id)
    .then((response) => {
      if (response !== false) {
        feedService.getFeeds(authenticationService.currentUserValue.id);
        this.props.history.push("/user");
      } else {
        this.setState({errorMsg: "There was a problem with this transaction. Please go back and try again."});
      }
    },
    error => {
      console.error(error);
    });
  }

  backButton(event) {
    event.preventDefault();
    this.props.history.push("/user");
  }

  render() {
    return (
      <div className="formContainer">
        <h2>Delete All Feeds</h2>
        <form onSubmit={this.handleSubmit}>
          <div className="left">
            &nbsp;
          </div>
          <div className="right">
            Are you sure you want to delete ALL the feeds in this account?
          </div>
          <div className="left">
            &nbsp;
          </div>
          <div className="right">
            <button type="submit" className="submitButton">Delete all feeds</button>
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

export default MyDetailsContent;
