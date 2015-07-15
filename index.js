// Libraries
var express = require('express');
var bodyParser = require('body-parser');
var _ = require('lodash');
var shortId = require('shortid');
var cookieParser = require('cookie-parser');
var session = require('express-session');

// User Modules
var fixtures = require('./fixtures.js');
var passport = require('./auth');
var config = require('./config');
var conn = require('./db');
var ensureAuthentication = require('./middleware/ensureAuthentication');

var app = express();
require('./middleware')(app)
require('./router')(app)

var server = app.listen(config.get('server:port'),config.get('server:host'));
console.log()
// var server = app.listen(3000,'127.0.0.1');
console.log("Listening on " + config.get('server:port'));
module.exports = server;
