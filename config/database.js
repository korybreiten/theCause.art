const Sequelize = require("sequelize");
const mysql = require("mysql2");

const connection = mysql.createConnection({
  user     : process.env.DATABASE_USER,
  password : process.env.DATABASE_PASSWORD
});
connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DATABASE_NAME}\`;`);

const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
  host: process.env.DATABASE_HOST,
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('../models/user')(sequelize, Sequelize);
db.Cause = require('../models/cause')(sequelize, Sequelize);
db.Auction = require('../models/auction')(sequelize, Sequelize);
db.Bid = require('../models/bid')(sequelize, Sequelize);

module.exports = db;