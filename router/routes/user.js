var express = require('express');
var router = express.Router();

var conn = require('../../db');
var ensureAuthentication = require('../../middleware/ensureAuthentication');

// POST /api/users
router.post('/', function(req,res) {
  var user = req.body.user;
  var User  = conn.model('User');

  User.create(user, function(err,user) {
    if (err) {
      var code = err.code === 11000 ? 409 : 500;
      return res.sendStatus(code);
    }
    req.login(user,function(err) {
      if (err) {
        return res.sendStatus(500);
      }
      res.sendStatus(200);
    });
  });
});

// GET /api/users/:userId
router.get('/:userId', function(req,res) {
  var userId = req.params.userId;
  var User  = conn.model('User');

  User.findOne({id:userId}, function(err,user) {

    if (err) {
      return res.sendStatus(500);
    }
    if (!user) {
      return res.sendStatus(404);
    }
    return res.send({
      user: user.toClient()
    });
  });
});

// PUT /api/users/:userId
router.put('/:userId', function(req,res) {
  var User  = conn.model('User');
  if (req.user.id !== req.params.userId) {
    return res.sendStatus(403);
  }
  var userId = req.params.userId;
  var newPassword = req.body.password;
  User.findOneAndUpdate({id: userId}, {password: newPassword}, function(err) {
    if (err) {
      return res.sendStatus(500);
    }
    return res.sendStatus(200);
  });
});

// POST /api/users/:userId/follow
router.post('/:userId/follow',ensureAuthentication, function(req,res) {
  var User = conn.model('User');
  var userId = req.params.userId;
  User.findByUserId(userId, function (err, user) {
    if (err) {
      return res.sendStatus(500);
    }
    if (!user) {
      return res.sendStatus(403);
    }
    req.user.follow(user.id, function(err) {
      if (err) return res.sendStatus(500);
      res.sendStatus(200);
    });
  });
});

// POST /api/users/:userId/unfollow
router.post('/:userId/unfollow', ensureAuthentication, function(req,res) {
  var User = conn.model('User');
  var userId = req.params.userId;

  User.findByUserId(userId, function(err,user) {
    if (err) {
      return res.sendStatus(500);
    }
    if (!user) {
      return res.sendStatus(403);
    }
    req.user.unfollow(user.id, function(err) {
      if (err) return res.sendStatus(500);
      res.sendStatus(200);
    });
  });
});

// POST /api/users/:userId/friends
router.get('/:userId/friends', function(req,res) {
  var User = conn.model('User');
  var userId = req.params.userId;
  User.findByUserId(userId, function(err,user) {
    if (err) {
      return res.sendStatus(500);
    }
    if (!user){
      return res.sendStatus(404);
    }
    user.getFriends(function(err, friends) {
      if (err) {
        return res.sendStatus(500);
      }
      var friendsClients = friends.map(function(user) { return user.toClient()});
      return res.send({users: friendsClients});
    });
  });
});

// POST /api/users/:userId/followers
router.get('/:userId/followers', function(req,res) {
  var User = conn.model('User');
  var userId = req.params.userId;
  User.findByUserId(userId, function(err, user) {
    if (err) {
      return res.sendStatus(500);
    }
    if (!user) {
      return res.sendStatus(404);
    }
    user.getFollowers(function(err, followers) {
      if (err) {
        return res.sendStatus(500)
      }
      var followersClients = followers.map(function(user) { return user.toClient()});
      return res.send({users: followersClients});
    });
  });
});

module.exports = router;
