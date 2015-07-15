var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('../auth');
module.exports = function(app) {
  app.use(bodyParser.json());
  app.use(cookieParser())
  app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  //cofigure app to handle CORS requests
  app.use(function(req, res, next) {
  	res.setHeader('Access-Control-Allow-Origin', '*');
  	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
  	next();
  });
  
}
