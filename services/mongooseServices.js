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
    address : {
      street : String,
      city : String,
      postCode : String
    },
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
      name : String, 
    	client : String,
    	description : String, 
    	address : String, 
    	area : String, 
    	level : Number,
      totalFloor : Number,
      existingFloor : Number,
      newFloor : Number, 
      lawfully : String, 
      yearConstructed : String
    },
    project : {
    	description : String, 
      useOfSite : {
        info : String,
        detail : String
      }, 
      workResult : String,
      life : String,
      preApp : {
        info : String, 
        number : String
      },
      value : String
    },
    people : [{
      peopleType : String,
      //Pro 
      type : { type: String },
      agentName : String, 
      name : String, 
      address : {
        street : String,
        suburb : String, 
        city : String, 
        postCode : String 
      },
      phone : String,
      website : String, 
      registration : String,
      mail : String,
      //licensed
      classL : String, 
      lbp : String, 
      certificat : String
      //client
    }],
    doc : [{
      url : String,
      name : String
    }],
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
    RFI:[{
      rfi_id : String,
      location : String,
      details : String, 
      response : String, 
      accepted : String,
      creted_by : String,
      date_letter_sent : String,
      date_of_response : String,
      date_signed_off : String,
      signed_off_by : String, 
      building_code_clause : String,
      building_code_sub_clause : String
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
      if (err) {callback(409); console.log("User :" +user + " affected :  " + affected );}
      else {
        if(affected == 1) callback(201, user.id);
        else {callback(409); console.log("User :" +user + " affected :  " + affected );}
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
  instance.owner = consent.owner;
  instance.councilRef = consent.councilRef;

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
        callback(201, consent.id, instance);
       }
      else{
        if (err) console.log(err);
        callback(undefined, 404);
      }
     });
    }
  });

}

/**
* Modify Consent
*/
exports.modifyConsent = function(id, consent, callback){
  db.on('error', console.error.bind(console, 'connection error:'));
  var ConsentModel = mongoose.model('Consent', schemas.consentSchema);
  this.getConsentById(id, function(instance){

        instance.title = consent.title;
        instance.client = consent.client;
        instance.address = consent.address;
        instance.status = consent.status;
        instance.user = consent.user;
        instance.owner = consent.owner;
        instance.councilRef = consent.councilRef;
        instance.buildingInfo = consent.buildingInfo;
        instance.project = consent.project;
        instance.people = consent.people;
        instance.doc = consent.doc;
        instance.more = consent.more;
        instance.workingDays = consent.workingDays;
        instance.notifications = consent.notifications;

        instance.save(function(err,instance){
          if(err){
            callback(404);
          }
          else
            callback(200);
        });
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
        return console.log("Real error : "+ err);
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
    if(user){
    var consentCount = user.consents.length;
    for (var i = 0; i < consentCount ; i++) {
      services.getConsentById(user.consents[i], function(consent){
        consents.push(consent);
        if(consents.length === consentCount) callback(consents);
      });
    }
  }else{
    callback();
  }
  });
}

exports.updatedDocument = function(doc, callback){
  db.on('error', console.error.bind(console, 'connection error:'));

  var ConsentModel = mongoose.model('Consent', schemas.consentSchema);
  var instance = new ConsentModel();
  var obj = {
    url : doc.url,
    name : doc.name
  };
  console.log(obj);
  ConsentModel.findOne({ _id: doc.idUser }, function(err, consent){
  if(!err && consent){
    console.log(consent);
    consent.doc.push(obj);
    consent.save();
    callback(200);
   }
  else{
    if (err) console.log(err);
  }
 });


}



