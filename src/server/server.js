const express    = require("express");
const mysql      = require("mysql");
const bodyParser = require("body-parser");
const connectionDetails = require("./../private/dbConfig.js");
const connection = mysql.createPool(connectionDetails);
const jwt = require('./../helpers/jwt');
const errorHandler = require('./../helpers/jwt-error-handler');
const app = express();

function showError(err) {
  console.log('Error while performing Query.');
  console.log(err);
}

app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['http://localhost:3000']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT');
    res.append('Access-Control-Allow-Headers', 'X-Requested-With, Accept, Content-Type');
    next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// use JWT auth to secure the api
app.use(jwt());

// api routes
app.use('/users', require('./../controllers/users.controller'));

// global error handler
app.use(errorHandler);

app.post("/beereader/getFeedsForUser", function(req, res) {
  const id = connection.escape(req.body.id);
  const sql = 'SELECT * from feeds WHERE userid = ' + id + ' ORDER BY sitename';
  connection.getConnection(function (err, connection) {
    connection.query(sql, function(err, rows, fields) {
      if (!err) {
        res.send(rows);
      }
      else {
        showError(err);
      }
      connection.release();
    });
  });
});

app.post("/beereader/checkAuth", function(req, res) {
  const username = connection.escape(req.body.username);
  const password = connection.escape(req.body.password);
  const sql = 'SELECT id, username, role from users WHERE username = ' + username + ' AND password = ' + password;
  connection.getConnection(function (err, connection) {
    connection.query(sql, function(err, rows, fields) {
      if (!err) {
        rows = res.json(rows);
        if (rows.length > 0) {
          res.send(rows);
        }
      }
      else {
        showError(err);
      }
      connection.release();
    });
  });
});

app.post("/beereader/editFeed", function(req, res) {
  const sitename = connection.escape(req.body.sitename);
  const siteurl = connection.escape(req.body.siteurl);
  const id = connection.escape(req.body.id);
  const sql = 'UPDATE feeds SET sitename = ' + sitename + ', siteurl = ' + siteurl + ' WHERE (id = ' + id + ')';
  connection.getConnection(function (err, connection) {
    connection.query(sql, function(err, rows, fields) {
      if (!err) {
        rows = res.json(rows);
        if (rows.length > 0) {
          res.send(rows);
        }
      }
      else {
        showError(err);
      }
      connection.release();
    });
  });
});

app.post("/beereader/deleteFeed", function(req, res) {
  const id = connection.escape(req.body.id);
  const sql = 'DELETE FROM feeds WHERE (id = ' + id + ');';
  connection.getConnection(function (err, connection) {
    connection.query(sql, function(err, rows, fields) {
      if (!err) {
        rows = res.json(rows);
        if (rows.length > 0) {
          res.send(rows);
        }
      }
      else {
        showError(err);
      }
      connection.release();
    });
  });
});

app.post("/beereader/deleteAllFeeds", function(req, res) {
  const userid = connection.escape(req.body.userid);
  const sql = 'DELETE FROM feeds WHERE (userid = ' + userid + ');';
  connection.getConnection(function (err, connection) {
    connection.query(sql, function(err, rows, fields) {
      if (!err) {
        rows = res.json(rows);
        if (rows.length > 0) {
          res.send(rows);
        }
      }
      else {
        showError(err);
      }
      connection.release();
    });
  });
});

app.post("/beereader/addFeed", function(req, res) {
  const sitename = connection.escape(req.body.sitename);
  const siteurl = connection.escape(req.body.siteurl);
  const userid = connection.escape(req.body.userid);
  const sql = 'INSERT INTO feeds (sitename, siteurl, userid) VALUES (' + sitename + ', ' + siteurl + ', ' + userid + ');';
  connection.getConnection(function (err, connection) {
    connection.query(sql, function(err, rows, fields) {
      if (!err) {
        rows = res.json(rows);
        if (rows.length > 0) {
          res.send(rows);
        }
      }
      else {
        showError(err);
      }
      connection.release();
    });
  });
});

app.get("/beereader/adminGetUsers/", function(req, res) {
  const sql = 'SELECT id, username, role FROM users ORDER BY username;';
  connection.getConnection(function (err, connection) {
    connection.query(sql, function(err, rows, fields) {
      if (!err) {
        rows = res.json(rows);
        if (rows.length > 0) {
          res.send(rows);
        }
      }
      else {
        showError(err);
      }
      connection.release();
    });
  });
});

app.post("/beereader/adminGetUser/", function(req, res) {
  const id = connection.escape(req.body.id);
  const sql = 'SELECT * FROM users WHERE id = ' + id;
  connection.getConnection(function (err, connection) {
    connection.query(sql, function(err, rows, fields) {
      if (!err) {
        rows = res.json(rows);
        if (rows.length > 0) {
          res.send(rows);
        }
      }
      else {
        showError(err);
      }
      connection.release();
    });
  });
});

app.post("/beereader/adminEditUser", function(req, res) {
  const username = connection.escape(req.body.username);
  const password = connection.escape(req.body.password);
  const role = connection.escape(req.body.role);
  const id = connection.escape(req.body.id);
  const sql = 'UPDATE users SET username = ' + username + ', password = ' + password + ', role = ' + role + ' WHERE (id = ' + id + ')';
  connection.getConnection(function (err, connection) {
    connection.query(sql, function(err, rows, fields) {
      if (!err) {
        rows = res.json(rows);
        if (rows.length > 0) {
          res.send(rows);
        }
      }
      else {
        showError(err);
      }
      connection.release();
    });
  });
});

app.post("/beereader/adminDeleteUser", function(req, res) {
  const username = connection.escape(req.body.username);
  const id = connection.escape(req.body.id);
  const sql = 'DELETE FROM users WHERE (id = ' + id + ');';
  connection.getConnection(function (err, connection) {
    connection.query(sql, function(err, rows, fields) {
      if (!err) {
        rows = res.json(rows);
        if (rows.length > 0) {
          res.send(rows);
        }
      }
      else {
        showError(err);
      }
      connection.release();
    });
  });
});

app.post("/beereader/adminAddUser", function(req, res) {
  const username = connection.escape(req.body.username);
  const password = connection.escape(req.body.password);
  const role = connection.escape(req.body.role);
  const sql = 'INSERT INTO users (username, password, role) VALUES (' + username + ', ' + password + ', ' + role + ');';
  connection.getConnection(function (err, connection) {
    connection.query(sql, function(err, rows, fields) {
      if (!err) {
        rows = res.json(rows);
        if (rows.length > 0) {
          res.send(rows);
        }
      }
      else {
        showError(err);
      }
      connection.release();
    });
  });
});

const port = process.env.NODE_ENV === 'production' ? 80 : 4000;

const server = app.listen(port, function () {
  var thisDate = new Date();
  // get the date as a string
  var date = thisDate.toDateString();
  // get the time as a string
  var time = thisDate.toLocaleTimeString();
 console.log(date + ", " + time + ": Now serving at http://localhost:" + port + "/.");
});