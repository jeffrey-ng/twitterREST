var mongoose = require('mongoose');
var _ = require('lodash');

var Schema = mongoose.Schema;

var tweetSchema = new Schema({
    username: String,
    created: Number,
    text: String
});

tweetSchema.methods.toClient = function() {
  var tweet = _.pick(this, ['username','created','text'])
  tweet.id = this._id;
  return tweet;
}
module.exports = tweetSchema;
