var express = require('express');
var router = express.Router();

var conn = require('../../db');
var jwt        = require('jsonwebtoken');
var config     = require('../../config');



// POST /api/auth/authenticate
// { "username": "c",
  // "password": "ccc"
// }
router.post('/authenticate', function(req,res) {
  var User  = conn.model('User');
  console.log("Authenticating");
  User.findOne({
    username: req.body.username
  }).select('name username password').exec(function(err, user) {

    if (err) throw err;

    // no user with that username was found
    if (!user) {
      res.json({
        success: false,
        message: 'Authentication failed. User not found.'
      });
    } else if (user) {

      // check if password matches
      var validPassword = user.comparePassword(req.body.password);
      if (!validPassword) {
        res.json({
          success: false,
          message: 'Authentication failed. Wrong password.'
        });
      } else {

        // if user is found and password is right
        // create a token
        var token = jwt.sign({
          name: user.name,
          username: user.username
        }, config.get('secret'), {
          expiresInMinutes: 1440 // expires in 24 hours
        });

        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Authenticated User. Enjoy your token!',
          token: token
        });
      }

    }

  });
});

// POST /api/auth/logout
router.post('/logout', function(req,res) {
  req.logOut();
  res.sendStatus(200);
});
module.exports = router;
