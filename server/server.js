const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const bcrypt = require("bcryptjs");
const app = express()

var corsOptions = {
  origin: "http://localhost:8080"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./models");

const User = db.user;
const Role = db.role;
const UserRole = db.userrole;
const Feed = db.feed;

db.sequelize.sync({force: true}).then(() => {
  console.log('Drop and Resync Db');
  initial();
});

const userConfig = require("./config/user.config.js");

function initial() {
  console.log(userConfig);
  User.create({
    id: 1,
    username: userConfig.user1.username,
    password: bcrypt.hashSync(userConfig.user1.password, 8)
  });

  User.create({
    id: 2,
    username: userConfig.user2.username,
    password: bcrypt.hashSync(userConfig.user2.password, 8)
  });

  Role.create(userConfig.role1);
 
  Role.create(userConfig.role2);

  Feed.create({
    id: 1,
    sitename: "Eurogamer",
    siteurl: "https://www.eurogamer.net/?format=rss&type=news",
    userid: 1
  });

  Feed.create({
    id: 2,
    sitename: "Rock Paper Shotgun",
    siteurl: "https://www.rockpapershotgun.com/feed/",
    userid: 2
  });

  Feed.create({
    id: 3,
    sitename: "Rock Paper Shotgun",
    siteurl: "https://www.rockpapershotgun.com/feed/",
    userid: 1
  });

  Feed.create({
    id: 4,
    sitename: "BBC News Europe",
    siteurl: "http://feeds.bbci.co.uk/news/world/europe/rss.xml",
    userid: 1
  });

  UserRole.create({
    userId: 1,
    roleId: 1
  });

  UserRole.create({
    userId: 2,
    roleId: 2
  });
}

function showError(err) {
  console.log('--------------- Error while performing Query.');
  console.log(err);
}

// routes
require('./routes/admin.routes')(app);
require('./routes/auth.routes')(app);
require('./routes/feed.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
