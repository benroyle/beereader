const db = require("../models");
const x2js = require('x2js');
const User = db.user;

const Op = db.Sequelize.Op;

var bcrypt = require("bcryptjs");

exports.adminGetUsers = (req, res) => {
  User.findAll({
    attributes: ['id', 'username'],
    order: [["username", "ASC"]]
  })
  .then(users => {
    res.send(users);
  })
  .catch(err => {
    res.status(500).send({message: err.message});
    return;
  });
};

exports.adminGetUser = (req, res) => {
  User.findOne({
    attributes: ['id', 'username'],
    where: {
      id: {
        [Op.eq]: req.body.id
      }
    }
  })
  .then(user => {
    if (!user) {
      res.status(404).send({message: "User is not found."});
      return;
    }
    res.send(user);
  })
  .catch(err => {
    res.status(500).send({message: err.message});
    return;
  });
};

exports.adminEditUser = (req, res) => {
  let userEdit = {
    username: req.body.username
  };
  if (req.body.password) {
    userEdit.password = bcrypt.hashSync(req.body.password, 8);
  }
  User.update(userEdit, {
    where: {
      id: {
        [Op.eq]: req.body.id
      }
    }
  })
  .then(data => {
    let message = {message: req.body.username + " was edited successfully."};
    res.send(message);
    return;
  })
  .catch(err => {
    res.status(500).send({message: err.message});
    return;
  });
};

exports.adminDeleteUser = (req, res) => {
  User.destroy({
    where: {
      id: {
        [Op.eq]: req.body.id
      },
      username: {
        [Op.eq]: req.body.username
      }
    }
  })
  .then(data => {
    console.log(data);
    let message = {message: req.body.username + " was deleted successfully."};
    res.send(message);
    return;
  })
  .catch(err => {
    res.status(500).send({message: err.message});
    return;
  });
};
