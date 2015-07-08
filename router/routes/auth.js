var express = require('express');
var router = express.Router();

var conn = require('../../db');
var passport = require('../../auth');

// POST /api/auth/login
router.post('/login', function(req,res) {
  passport.authenticate('local', function(err, user,info) {
    if (err) {
      return res.sendStatus(500);
    }
    if (!user) {
      return res.sendStatus(403);
    }

    req.login(user, function(err) {
      if (err) { return res.sendStatus(500); }
      return res.send({user: user.toClient()});
    });
  })(req,res);
});

// POST /api/auth/logout
router.post('/logout', function(req,res) {
  req.logOut();
  res.sendStatus(200);
});
module.exports = router;
