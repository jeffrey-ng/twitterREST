var express = require('express');
var router = express.Router();

var conn = require('../../db');
var ensureAuthentication = require('../../middleware/ensureAuthentication');

// GET /api/tweets
router.get('/', function(req,res) {
  var Tweet = conn.model('Tweet');
  var userId = req.query.userId;
  var stream = req.query.stream;
  var query = null
  var options = {sort: {created:-1}};

  if (stream === 'profile_timeline' && userId) {
    query = {userId: userId};

  } else if (stream ==='home_timeline') {
    query =  {userId: { $in: req.user.followingIds }}

  } else {
    return res.sendStatus(400);
  }

  Tweet.find(query, null, options, function(err,tweets) {
    if (err) {
      return res.sendStatus(500);
    }
    var returnTweets = tweets.map(function(tweet){return tweet.toClient()});
    res.send({tweets: returnTweets});
  });
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
  tweet.userId = req.user.id
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
    if (tweet.userId !== req.user.id) {
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
