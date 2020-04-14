const db = require("../models");
const User = db.user;

checkDuplicateUserName = (req, res, next) => {
  User.findOne({
    where: {
      username: req.body.username
    }
  })
  .then(user => {
    if (user) {
      res.status(400).send({
        message: "FAILED: A user with the name of '" + user.username + "' already exists."
      });
      return;
    } else {
      next();
    }
  });
};

const verifyUsers = {
  checkDuplicateUserName: checkDuplicateUserName
};

module.exports = verifyUsers;