var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var _ = require('lodash');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    name: String,
    username: { type: String, unique: true },
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
    console.log("hashing password");
    next();
  });
});

userSchema.methods.toClient = function() {
  var user = _.pick(this, ['username','name']);
  return user;
}
// method to compare a given password with the database hash
userSchema.methods.comparePassword = function(password) {
	var user = this;

	return bcrypt.compareSync(password, user.password);
};


userSchema.statics.findByUserName = function(username, done) {
  this.findOne({username:username},done);
};
userSchema.methods.follow = function(username, done) {
	var update = { $addToSet: { followingIds: username }};
	this.model('User').findByIdAndUpdate(this._id, update, done);
}

userSchema.methods.unfollow = function(username, done) {
	var update = { $pull: { followingIds: username }};
	this.model('User').findByIdAndUpdate(this._id, update, done);
}

userSchema.methods.getFriends = function(done) {
  this.model('User').find({username: {$in: this.followingIds}}, done);
}
userSchema.methods.getFollowers = function(done) {
  this.model('User').find({followingIds: {$in :[this.username]}}, done);
}
module.exports = userSchema;
