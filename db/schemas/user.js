var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var _ = require('lodash');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    id: { type: String, unique: true },
    name: String,
    username: { type: String, required: true, index: { unique: true }},
    email: { type: String, unique: true },
    password: { type: String, required: true, select: false },
    followingIds: { type: [String], default: [] }
});
userSchema.pre('save', function(next) {
  var _this = this;
  bcrypt.hash(this.password, 10, function(err, passHash) {
    if (err) {
      next(err);
    }
    _this.password = passHash;
    next();
  });
});

userSchema.methods.toClient = function() {
  var user = _.pick(this, ['id','name']);
  return user;
}

userSchema.statics.findByUserId = function(id, done) {
  this.findOne({id:id},done);
};
userSchema.methods.follow = function(userId, done) {
	var update = { $addToSet: { followingIds: userId }};
	this.model('User').findByIdAndUpdate(this._id, update, done);
}

userSchema.methods.unfollow = function(userId, done) {
	var update = { $pull: { followingIds: userId }};
	this.model('User').findByIdAndUpdate(this._id, update, done);
}

userSchema.methods.getFriends = function(done) {
  this.model('User').find({id: {$in: this.followingIds}}, done);
}
userSchema.methods.getFollowers = function(done) {
  this.model('User').find({followingIds: {$in :[this.id]}}, done);
}
module.exports = userSchema;
