var services = require('../services/mongooseServices');
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
    consents : [String]
  }),

  consentSchema : new mongoose.Schema({
    title : String,
    client : String,
    address : String,
    councilRef : String,
    status : String,
    user : String,
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

/**
* Create consent 
*/ 
exports.createConsent = function(consent, callback){
  db.on('error', console.error.bind(console, 'connection error:'));

  var ConsentModel = mongoose.model('Consent', schemas.consentSchema);
  var UserModel = mongoose.model('User', schemas.userSchema);

  var instance = new ConsentModel();
  var user = new UserModel();


  instance.title = consent.title;
  instance.client = consent.client;
  instance.address = consent.address;
  instance.status = consent.status;
  instance.user = consent.user;

  instance.save(function (err, consent) {
    if (err) {
      console.log(err);
      callback(409);
    }
    else {
      
      UserModel.findOne({ _id: consent.user }, function(err, user){
      if(!err && user){
        user.consents.push(consent.id);
        user.save(callback);
        instance.save(callback);
        callback(201, consent.id);
       }
      else{
        if (err) console.log(err);
        callback(undefined, 404);
      }
     });
    }
  });

}

/*
* Get consent by ID
*/

exports.getConsentById = function(id, callback){
  db.on('error', console.error.bind(console, 'connection error:'));

  var ConsentModel = mongoose.model('Consent', schemas.consentSchema);

  ConsentModel.findOne({ _id: id }, function(err, consent){
      if(!err){
        callback(consent);
      }
      else
        return console.log(err);
    });
}


/**
* Get all consents by user
*/
exports.getConsentsByUser = function(idUser, callback){
  db.on('error', console.error.bind(console, 'connection error:'));

  var ConsentModel = mongoose.model('Consent', schemas.consentSchema);
  var UserModel = mongoose.model('User', schemas.userSchema);

  var instance = new ConsentModel();
  var user = new UserModel();
  var consents = new Array();
  this.getUserById(idUser, function(user){
    var consentCount = user.consents.length;
    for (var i = 0; i < consentCount ; i++) {
      services.getConsentById(user.consents[i], function(consent){
        consents.push(consent);
        if(consents.length === consentCount) callback(consents);
      });
    };
  });
  console.log(consents);
}



