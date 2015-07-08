var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var _ = require('lodash');
var bcrypt = require('bcrypt');
var conn = require('./db');
var fixtures = require('./fixtures.js');


passport.serializeUser(function(user,done) {
  done(null, user.id);
});

passport.deserializeUser(function(id,done) {
  var User = conn.model('User');
  User.findOne({id: id}, function(err, user) {
    if (!user) {
      return done(null,false);
    }
    done(null,user);
  })
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    var User = conn.model('User');
    User.findOne({id:username}, function(err,user) {
      if (err) {
        return done(err)
      }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      // bcrypt.compare(password,user.password, function(err, matched) {
      //   if (err) {
      //     return done(err);
      //   }
      //   if matched {
      //     done(null,user);
      //   } else {
      //     done(null,false, {message: 'Incorrect password.'});
      //   }
      // })
      bcrypt.compare(password,user.password,function( err,matched) {
        if (err) {
          return done(err);
        }
        if (matched) {
          done(null,user);
        } else {
          done(null,false,{message: 'Incorrect password.'});
        }
      });
    });
  }
));
module.exports = passport