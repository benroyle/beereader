import React from 'react';
import axios from 'axios';
import parse from 'html-react-parser';
import x2js from 'x2js';
import { feedService } from './services/feed.service.js';

//const corsUrl = "https://api.rss2json.com/v1/api.json?rss_url=";

class Content extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			feeds: [],
			loading: false,
			errorMsg: ''
		}
	}

	showFeedItems() {
		const isRandom = feedService.randomValue;
		const items = document.querySelectorAll("div.contentDiv > div.item");
		let item = '';
		if (isRandom === false) {
			item = items[0]
		} else {
			const randomItemNum = feedService.getRandomNumber(items.length);
			item = items[randomItemNum];
		}
		if ((items !== undefined) && (item !== undefined)) {
			items.forEach(items => {
				items.className = "item closed";
			});
			item.className = "item opened";
		}
	}

	feedError(error, feedUrl) {
		if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      //console.log(error.response.data);
      //console.log(error.response.status);
      //console.log(error.response.headers);
      if (error.response.status === 422) {
      	this.setState({errorMsg: feedUrl + " is an invalid RSS feed. Please amend this URL as necessary in the My Details page and try again."});
      } else {
      	this.setState({errorMsg: feedUrl + " has returned the following error:\n\n" + error.message + "\n\nPlease amend this URL as necessary in the My Details page and try again."});
      }
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      //console.log(error.request);
      this.setState({errorMsg: feedUrl + " isn't returning anything. Please amend this URL as necessary in the My Details page and try again."});
    } else {
      // Something happened in setting up the request that triggered an Error
      //console.log('Error', error.message);
      this.setState({errorMsg: feedUrl + " has returned the following error:\n\n" + error.message + "\n\nPlease amend this URL as necessary in the My Details page and try again."});
    }
	}

	getFeed() {
		if ((this.props.feed) && (this.props.feed.siteurl)) {
			const url = this.props.feed.siteurl;
			if (url !== undefined) {
				this.setState({loading: true});
				axios.get(url)
				.then((result) => {
					const newX2js = new x2js();
		    	result = newX2js.xml2js(result.data);
		    	return result;
		    })
		    .then((result) => {
		    	let feedItemsArray = [];
		    	if (result.rss) {
		    		if (Array.isArray(result.rss.channel.item)) {
		    			feedItemsArray = result.rss.channel.item;
			    	}
		    	}
		    	if (result.feed) {
		    		if (Array.isArray(result.feed.entry)) {
		    			feedItemsArray = result.feed.entry;
			    	}
		    	}
		    	if (result.html) {
		    		let error = {};
		    		error.message = "The URL has returned HTML, not a valid feed."
		    		this.feedError(error, url);
		    	}
		    	if (feedItemsArray.length > 10) {
		    		const excess = (feedItemsArray.length - 10);
		    		feedItemsArray.splice(10, excess);
		    	}
		    	this.setState({feeds: feedItemsArray});
		    	return true;
		    })
		    .then((result) => {
		    	this.setState({loading: false});
		    	this.showFeedItems();
		    })
		    .catch((error)=> {
		    	this.setState({loading: false});
	    		this.feedError(error, url);
	      })
		  }
		}
	}

	componentDidUpdate(prevProps) {
		if ((this.props.feed) && (this.props.feed !== prevProps.feed)) {
			this.setState({errorMsg: ''});
			this.setState({feeds: []});
			this.getFeed();
		}
	}

	componentDidMount() {
		if (this.props.feed) {
			this.getFeed();
		}
	}

	renderFeed() {
  	const feeds = this.state.feeds.map((feed, index) =>
			<FeedItem key={index} myKey={index} feed={feed} />
		);
		return feeds;
	}

	renderErrorMsg() {
		if (this.state.errorMsg !== "") {
			return (<ErrorItem errorMsg={this.state.errorMsg} />);
		}
	}

	render() {
		let feed = this.props.feed;
		if (!feed) {
			feed = {
				sitename: "No feeds yet"
			};
		}
		if (this.state.loading === true) {
			return (
				<div className="contentDiv">
					<div className="contentHeader">
	      		Loading...
	      	</div>
					<div className="item">
						<div className="title">
							Please wait.
						</div>
					</div>
				</div>
			)
		} else {
			return (
				<div className="contentDiv">
					<div className="contentHeader">
	      		{feed.sitename}
	      	</div>
	      	{this.renderFeed()}
	      	{this.renderErrorMsg()}
		    </div>
			)
		}
	}
}

function openItem(index) {
	if (!index) {
		index = 0;
	}
	const items = document.querySelectorAll("div.contentDiv > div.item");
	const item = items[index];
	if ((items) && (item)) {
		if (item.className === "item opened") {
			item.className = "item closed";
		} else {
			items.forEach(items => {
				items.className = "item closed";
			});
			item.className = "item opened";
			if ((item.offsetHeight + item.offsetTop) >= (document.body.scrollHeight - 145)) {
				item.scrollIntoView();
			}
		}
	}
}

class FeedItem extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			date: '',
			title: '',
			content: '',
			link: ''
		}
	}

	processFeed() {
		this.setState({content: ''});
		this.setState({link: ''});
		if (this.props.feed.date) {
			this.setState({date: this.props.feed.date});
		}
		if (this.props.feed.updated) {
			this.setState({date: this.props.feed.updated});
		}
		if (this.props.feed.pubDate) {
			this.setState({date: this.props.feed.pubDate});
		}
		if (this.props.feed.title.__text) {
			this.setState({"title": this.props.feed.title.toString()});
		} else {
			this.setState({"title": this.props.feed.title});
		}
		if (this.props.feed.encoded) {
			this.setState({content: this.props.feed.encoded.toString()});
			return true;
		}
		if (this.props.feed.content) {
			this.setState({content: this.props.feed.content.toString()});
			return true;
		}
		if (this.props.feed.summary) {
			this.setState({content: this.props.feed.summary.toString()});
			if (typeof this.props.feed.link === 'string') {
				this.setState({link: this.props.feed.link});
			}
			return true;
		}
		if (this.props.feed.description) {
			this.setState({content: this.props.feed.description});
			if (typeof this.props.feed.link === 'string') {
				this.setState({link: this.props.feed.link});
			}
			return true;
		}
	}

	componentDidMount() {
		if (this.props.feed !== "") {
			this.processFeed();
		}
	}

	componentDidUpdate(prevProps) {
		if ((this.props.feed !== "") && (prevProps.feed !== this.props.feed)) {
			this.processFeed();
		}
	}

	render() {
		return (
			<div key={this.props.myKey} className="item closed">
				<div className="title" onClick={openItem.bind(this, this.props.myKey)}>
					{parse(this.state.title)}
				</div>
				{this.state.date &&
					<div className="date">
						{this.state.date}
					</div>
				}
				<div className="content">
					{parse(this.state.content)}
				</div>
				{this.state.link &&
					<div className="link">
						Read more: <a href={parse(this.state.link)} target="_blank" rel="noopener noreferrer">{parse(this.state.link)}</a>
					</div>
				}
			</div>
		);
	}
}

class ErrorItem extends React.Component {
	render() {
		return (
			<div className="contentErrorMsg">
				{this.props.errorMsg}
			</div>
		);
	}
}

export default Content;