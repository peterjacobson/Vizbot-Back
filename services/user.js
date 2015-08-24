var mongoose = require('mongoose'),
    bcrypt = require('bcrypt-nodejs');

var UserSchema = mongoose.Schema({
    name : String,
    mail : {type: String, 
        required: true,
        index: {unique: true}
    },
    pwd :{
    type: String, 
        required: true,
  },
    status: String,
    registration : String,
    address : {
      street : String,
      city : String,
      postCode : String
    },
    phone : String,
    consents : [String], 
    shareConsents : [String],
    team : [String]
  });

UserSchema.methods.verifyPassword = function(pass, cb) {
  bcrypt.compare(pass, this.pwd, function(err, isMatch) {
    if (err) return cb(err);
    return cb(null, isMatch);
  });
};

UserSchema.pre('save', function(callback) {
  var user = this;

  // Break out if the password hasn't changed
  if (!user.isModified('pwd')) return callback();

  // Password changed so we need to hash it
  bcrypt.genSalt(5, function(err, salt) {
    if (err) return callback(err);

    bcrypt.hash(user.pwd, salt, null, function(err, hash) {
      if (err) return callback(err);
      user.pwd = hash;
      callback();
    });
  });
});

module.exports  = mongoose.model('User', UserSchema);

