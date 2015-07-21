var express = require('express');
var router = express.Router();

var conn = require('../../db');
var ensureAuthentication = require('../../middleware/ensureAuthentication');

// GET /api/tweets
router.get('/', function(req,res) {
  var Tweet = conn.model('Tweet');
  var User = conn.model('User');
  var username = req.query.username;
  var stream = req.query.stream;
  var query = null
  var options = {sort: {created:-1}};
  console.log(username);


  console.log("before")

  if (stream === 'profile_timeline' && username) {
    query = {username: username};
    Tweet.find(query, null, options, function(err,tweets) {
      if (err) {
        return res.sendStatus(500);
      }
      var returnTweets = tweets.map(function(tweet){return tweet.toClient()});
      res.send({tweets: returnTweets});
    });

  } else if (stream ==='home_timeline') {
    User.findByUserName(username, function(err, user) {
      query =  {username: { $in: user.followingIds }}
      Tweet.find(query, null, options, function(err,tweets) {
        if (err) {
          return res.sendStatus(500);
        }
        var returnTweets = tweets.map(function(tweet){return tweet.toClient()});
        res.send({tweets: returnTweets});
      });
    })

  } else {
    return res.sendStatus(400);
  }
    // Tweet.find(query, null, options, function(err,tweets) {
    //   if (err) {
    //     return res.sendStatus(500);
    //   }
    //   var returnTweets = tweets.map(function(tweet){return tweet.toClient()});
    //   res.send({tweets: returnTweets});
    // });

});

// GET /api/tweets/:tweetId
router.get('/:tweetId', function(req,res) {
  var Tweet = conn.model('Tweet');
  var tweetId = req.params.tweetId;
  var tweet = _.find(fixtures.tweets, 'id',tweetId);
  Tweet.findById(tweetId, function(err,tweet) {
    if (err) {
      return res.sendStatus(500);
    }
    if (!tweet) {
      return res.sendStatus(404);
    }
    res.send({tweet:tweet.toClient()})
  });
});

// POST /api/tweets
router.post('/',ensureAuthentication,function(req,res) {
  var Tweet  = conn.model('Tweet');
  var tweet = req.body.tweet;
  console.log(req.body);
  console.log(tweet);
  // tweet.username = req.user.username
  tweet.created = Math.floor(Date.now() / 1000);

  Tweet.create(tweet, function(err,tweet) {
    if (err) {
      return res.sendStatus(500);
    }
    res.send({tweet:tweet.toClient()});
  });
});

// DELETE /api/tweets/:tweetId
router.delete('/:tweetId', ensureAuthentication, function(req,res) {
  var Tweet = conn.model('Tweet');
  var tweetId = req.params.tweetId;
  Tweet.findById(tweetId, function(err,tweet) {
    if (err) {
      return res.sendStatus(500);
    }
    if (!tweet) {
      return res.sendStatus(404);
    }
    if (tweet.username !== req.user.username) {
      return res.sendStatus(403);
    }
    Tweet.findByIdAndRemove(tweetId, function(err) {
      if (err) {
        return res.sendStatus(500);
      }
      res.sendStatus(200);
    });
  });
});

module.exports = router;
