var mongoose = require('mongoose');
var uri = "mongodb://127.0.0.1:27017/Vizbot";

mongoose.connect(uri);
var db = mongoose.connection;

var schemas = {
  userSchema : new mongoose.Schema({
    name : String,
    mail : String,
    pwd : String,
    registration : String,
    address : String,
    consents : [Number]
  }),

  consentSchema : new mongoose.Schema({
    title : String,
    client : String,
    address : String,
    councilRef : String,
    status : String,
    buildingInfo : {
    	client : String,
    	description : String, 
    	location : String, 
    	area : String, 
    	levels : Number
    },
    project : {
    	description : String, 
    	currentUse : String, 
    	changeUse : String
    },
    people : [{
    	registration : String, 
    	name : String, 
    	address : String, 
    	mail : String, 
    	phone : String, 
    	Role : String
    }],
    doc : [String],
    more : {
    	authorization : String, 
    	signature : String, 
    	date : Date
    },
    notifications : [{
    	message : String,
    	from : String, 
    	warning : String,
    	action : String
    }],
    workingDays : Number
  })
}


/**
* Seek the user with the given id
*/
exports.getUserById = function(id, callback){
  db.on('error', console.error.bind(console, 'connection error:'));
    var UserModel = mongoose.model('User', schemas.userSchema);

    UserModel.findOne({ _id: id }, function(err, user){
      if(!err){
        callback(user);
      }
      else
        return console.log(err);
    });
}

/**
* Create a new user
*/
exports.createUser = function(user, callback){

  db.on('error', console.error.bind(console, 'connection error:'));

    var UserModel = mongoose.model('User', schemas.userSchema);

    var instance = new UserModel();

    instance.name = user.name;
    instance.mail = user.mail;
    instance.pwd = user.pwd;
    instance.registration = user.registration;
    instance.address = user.address;

    instance.consents = [];

    instance.save(function (err, user, affected) {
      if (err) callback(409);
      else {
        if(affected == 1) callback(201, user.id);
        else callback(409);
      }
  });
}

/**
* LogIn
*/
exports.logIn = function(mail, pwd, callback){
  db.on('error', console.error.bind(console, 'connection error:'));
  var UserModel = mongoose.model('User', schemas.userSchema);
  console.log("mail");
  console.log(mail);
  console.log(pwd);
  UserModel.findOne({ mail: mail, pwd : pwd }, function(err, user){
    if(!err && user){
      callback(user.id, 200);
    }
    else{
      if (err) console.log(err);
      callback(undefined, 404);
    }
  });
}



