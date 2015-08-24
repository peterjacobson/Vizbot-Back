var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var User = require('../models/user.js');

passport.use(
  new BasicStrategy(
    function(mail, password, callback){
      User.findOne({ mail : mail }, function (err, user) {
        if (err) { return callback(err); }

      // No user found with that username
      if (!user) { return callback(null, false); }

      // Make sure the password is correct
      user.verifyPassword(password, function(err, isMatch) {
        if (err) { return callback(err); }

        // Password did not match
        if (!isMatch) { return callback(null, false); }

        // Success
        callback(null, user);
        console.log(isMatch);
      });
    });
    }));


exports.isAuthenticated = passport.authenticate('basic', { session : false });

