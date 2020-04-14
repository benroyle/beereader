module.exports = (sequelize, Sequelize) => {
  const UserRole = sequelize.define("user_roles", {
  	userId: {
      type: Sequelize.INTEGER
    },
    roleId: {
      type: Sequelize.INTEGER
    }
  });
  return UserRole;
};