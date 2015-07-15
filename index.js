// Libraries
var express = require('express');
var bodyParser = require('body-parser');
var _ = require('lodash');
var shortId = require('shortid');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var path = require('path');

// User Modules
var passport = require('./auth');
var config = require('./config');
var conn = require('./db');
var ensureAuthentication = require('./middleware/ensureAuthentication');

var app = express();
app.use(express.static(__dirname+'/public'));
require('./middleware')(app)
require('./router')(app)

app.get('*', function(req,res) {
  res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
})

var server = app.listen(config.get('server:port'),config.get('server:host'));
console.log()
console.log("Listening on " + config.get('server:port'));
module.exports = server;
