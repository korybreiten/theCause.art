require('dotenv').config();

const express = require('express');
const path = require('path');
const logger = require('morgan');
const favicon = require('serve-favicon');
const cors = require('cors');

require('./config/database');
require('./src/automation');

// Require controllers here

const app = express();

// add in when the app is ready to be deployed
// app.use(favicon(path.join(__dirname, 'build', 'favicon.ico')));
app.use(cors());
app.use(logger('dev'));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'build'))); // this allows express to find the build folder
// Configure the auth middleware
// This decodes the jwt token, and assigns
// the user information to req.user
app.use(require('./config/auth')); 
// api routes must be before the "catch all" route
app.use('/users', require('./routes/users'));
app.use('/images', require('./routes/images'));
app.use('/search', require('./routes/search'));
app.use('/causes', require('./routes/causes'));
app.use('/auctions', require('./routes/auctions'));
app.use('/bids', require('./routes/bids'));

// "catch all" route
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const db = require("./config/database");
db.sequelize.sync();



const expressPort = process.env.EXPRESS_PORT || 8080;

app.listen(expressPort, function() {
  console.log(`Express app listening on port ${expressPort}`);
});
