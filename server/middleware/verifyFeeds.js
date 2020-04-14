const db = require("../models");
const FEEDS = db.FEEDS;
const Feed = db.feed;

checkDuplicateFeedName = (req, res, next) => {
  Feed.findOne({
    where: {
      sitename: req.body.sitename,
      userid: req.body.userid
    }
  })
  .then(feed => {
    if (feed) {
      res.status(400).send({
        message: "FAILED: A feed with the name of '" + feed.sitename + "' already exists for this user."
      });
      return;
    } else {
      next();
    }
  });
};

checkDuplicateFeedURL = (req, res, next) => {
  Feed.findOne({
    where: {
      siteurl: req.body.siteurl,
      userid: req.body.userid
    }
  })
  .then(feed => {
    if (feed) {
      res.status(400).send({
        message: "FAILED: A feed with the URL of '" + feed.siteurl + "' already exists for this user"
      });
      return;
    } else {
      next();
    }
  });
};

const verifyFeeds = {
  checkDuplicateFeedName: checkDuplicateFeedName,
  checkDuplicateFeedURL: checkDuplicateFeedURL
};

module.exports = verifyFeeds;