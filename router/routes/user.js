var express = require('express');
var router = express.Router();

var conn = require('../../db');
var ensureAuthentication = require('../../middleware/ensureAuthentication');
var jwt        = require('jsonwebtoken');
var config     = require('../../config');



// POST /api/users
// { "user": {
//     "username": "c",
//     "name": "c",
//     "email": "cc",
//     "password": "ccc"
//   }
// }
router.post('/', function(req,res) {
  var user = req.body.user;
  var User  = conn.model('User');
  User.create(user, function(err,newUser) {
    console.log(newUser);
    if (err) {
      var code = err.code === 11000 ? 409 : 500;
      console.log(err.code)
      return res.sendStatus(code);
    }
    console.log("created");
    console.log(config.get('secret'));

    var token = jwt.sign({
      name: user.name,
      username: user.username
    }, config.get('secret'), {
      expiresInMinutes: 1440 // expires in 24 hours
    });

    // return the information including token as JSON
    res.json({
      success: true,
      message: 'Enjoy your token!',
      token: token
    });

  });
});
router.get('/',function(req,res) {
  var User = conn.model('User')
  User.find({}, function(err, users) {
      if (err) res.send(err);

      // return the users
      res.json(users);
    });
});


router.get('/me', ensureAuthentication,function(req, res) {
  res.send(req.decoded);
});


// GET /api/users/:username
router.get('/:username', function(req,res) {
  console.log(req.params.username);
  var username = req.params.username;
  var User  = conn.model('User');

  User.findOne({username:username}, function(err,user) {

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


// PUT /api/users/:username
router.put('/:username', function(req,res) {
  var User  = conn.model('User');
  if (req.user.username !== req.params.username) {
    return res.sendStatus(403);
  }
  var username = req.params.username;
  var newPassword = req.body.password;
  User.findOneAndUpdate({username: username}, {password: newPassword}, function(err) {
    if (err) {
      return res.sendStatus(500);
    }
    return res.sendStatus(200);
  });
});

// POST /api/users/:username/follow
router.post('/:username/follow',ensureAuthentication, function(req,res) {
  var User = conn.model('User');
  var followUsername = req.params.username;
  var myUsername = req.body.username;
  User.findByUserName(followUsername, function (err, followUser) {
    if (err) {
      return res.sendStatus(500);
    }
    if (!followUser) {
      return res.sendStatus(403);
    }
    console.log(req.body);
    User.findByUserName(myUsername, function(err,myUser) {
      if (err) {
        return res.sendStatus(500);
      }
      if(!myUser) {
        return res.sendStatus(403);
      }
      myUser.follow(followUser.username, function(err) {
        if (err) return res.sendStatus(500);
        res.sendStatus(200);
      })
    })
  });
});

// POST /api/users/:username/unfollow
router.post('/:username/unfollow', ensureAuthentication, function(req,res) {
  var User = conn.model('User');
  var unfollowUsername = req.params.username;
  var myUsername = req.body.username;

  User.findByUserName(unfollowUsername, function(err,unfollowUser) {
    if (err) {
      return res.sendStatus(500);
    }
    if (!unfollowUser) {
      return res.sendStatus(403);
    }
    User.findByUserName(myUsername, function(err,myUser) {
      if (err) {
        return res.sendStatus(500);
      }
      if(!myUser) {
        return res.sendStatus(403);
      }
      myUser.unfollow(unfollowUser.username, function(err) {
        if (err) return res.sendStatus(500);
        res.sendStatus(200);
      })
    })
  });
});

// POST /api/users/:username/friends
router.get('/:username/friends', function(req,res) {
  var User = conn.model('User');
  var username = req.params.username;
  User.findByUserName(username, function(err,user) {
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

// GET /api/users/:username/followers
router.get('/:username/followers', function(req,res) {
  var User = conn.model('User');
  var username = req.params.username;
  User.findByUserName(username, function(err, user) {
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
