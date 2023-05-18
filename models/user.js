const bcrypt = require('bcryptjs');
const saltRounds = 6;

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("User", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    funds: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: true
    },
    paypalEmail: {
      type: Sequelize.STRING,
      allowNull: true
    },
    clientId: {
      type: Sequelize.STRING,
      allowNull: true
    },
    bio: {
      type: Sequelize.STRING,
      allowNull: true
    },
    avatar: {
      type: Sequelize.STRING,
      allowNull: true
    },
    auction1: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    auction2: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    auction3: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    cause1: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    cause2: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    cause3: {
      type: Sequelize.INTEGER,
      allowNull: true
    }
  },
  {
    instanceMethods: {
      validPassword: (password) => {
      return bcrypt.compareSync(password, this.password);
      }
    }
  });
  User.prototype.validPassword = (password, hash) => {
  return bcrypt.compareSync(password, hash);
  }
  return User;
};