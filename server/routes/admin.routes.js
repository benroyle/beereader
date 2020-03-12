const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/beereader-vue/adminGetUsers/", function(req, res) {
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

  app.post("/beereader-vue/adminGetUser/", function(req, res) {
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

  app.post("/beereader-vue/adminEditUser", function(req, res) {
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

  app.post("/beereader-vue/adminDeleteUser", function(req, res) {
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

  app.post("/beereader-vue/adminAddUser", function(req, res) {
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
};