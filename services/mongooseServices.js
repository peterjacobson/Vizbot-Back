var services = require('../services/mongooseServices'),
    bcrypt = require('bcrypt-nodejs'),
    mongoose = require('mongoose'),
    uri = "mongodb://127.0.0.1:27017/Vizbot",
    User = require('../models/user.js')

mongoose.connect(uri);

var db = mongoose.connection;

var schemas = {

  consentSchema : new mongoose.Schema({
    title : String,
    role : String,
    address : String,
    councilRef : String,
    status : String,
    user : String,
    submitted : Boolean,
    vettingDescription : String,
    consentNumber:  String,
    valuation : String,
    legalDescription : String,
    lawfullyUse : {
      first : String,
      second : String
    },
    newUse : {
      first : String,
      second : String
    },
    processing : [{          
      location: String,     
      status: String,
      status_date: String,
      livedays: Number,
      suspendeddays: Number,
      totaldays: Number
    }], 
    numberPeople : Number,
    old : Number,
    buildingWork : String,
    buildingInfo : {
      name : String,  
      address : String, 
      area : String, 
      level : String,
      totalFloor : String,
      newFloor : String,
      speSystem : Boolean,
      speUpdate : String,
      speFollows : String 
    },
    project : {
      info : Boolean, 
      number : String,
      value : String
    },
    agent: {
      name : String, 
      address : {
        street : String,
        suburb : String, 
        city : String, 
        postCode : String 
      },
      phone : String,
      mail : String,
      website : String
    },
    client: {
      name : String, 
      address : {
        street : String,
        suburb : String, 
        city : String, 
        postCode : String 
      },
      phone : String,
      mail : String,
      website : String
    },
    contact: {
      name : String, 
      address : {
        street : String,
        suburb : String, 
        city : String, 
        postCode : String 
      },
      phone : String,
      mail : String,
      website : String
    },
    lbp: [{
      name: String,
      classL : String, 
      lbp : String, 
      certificat : String
    }],
    people : [{
      type : { type: String },
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
      mail : String
    }],
    doc : [{
      url : String,
      name : String
    }],
    compliance : [{
      url : String,
      name : String,
      clause : String
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
    created_by : String,
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
  User.findOne({ _id: id }, function(err, user){
    if(!err){
      callback(user);
    }
    else
      return console.log(err);
  });
}

/**
* Check authentication
**/
exports.checkAuth = function(mail, password, callback){
  db.on('error', console.error.bind(console, 'connection error:'));
  
}

/**
* Create a new user
*/
exports.createUser = function(user, callback){

  db.on('error', console.error.bind(console, 'connection error:'));
  var instance = new User();

  instance.name = user.name;
  instance.mail = user.mail;
  instance.pwd = user.pwd;
  instance.registration = user.registration;
  instance.address = user.address;

  instance.consents = [];

  instance.save(function (err, user, affected) {
    if (err) {callback(409);}
    else {
      if(affected == 1) callback(201, user.id);
      else {callback(409);}
    }
  });
}

/**
* LogIn
*/
exports.logIn = function(mail, pwd, callback){
  db.on('error', console.error.bind(console, 'connection error:'));
  console.log(mail);
  console.log(pwd);
  User.findOne({ mail: mail}, function(err, user){
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

  var instance = new ConsentModel();
  var user = new User();

  instance.user = consent.user;
  instance.title = consent.title;
  instance.role = consent.role;
  instance.address = consent.address;
  instance.status = consent.status;
  instance.councilRef = consent.councilRef;
  instance.lawfullyUse = consent.lawfullyUse;
  instance.newUse = consent.newUse;
  instance.numberPeople = consent.numberPeople;
  instance.old = consent.old;
  instance.buildingWork = consent.buildingWork;
  instance.valuation = consent.valuation;
  instance.legalDescription = consent.legalDescription;

  instance.save(function (err, consent) {
    if (err) {
      console.log(err);
      callback(409);
    }
    else {
      User.findOne({ _id: consent.user }, function(err, user){
        if(!err && user){
          user.consents.push(consent.id);
          user.save(callback);
          if(consent.role === "Agent"){
            instance.agent = {
              name : user.name, 
              address : user.address,
              phone : user.phone,
              mail : user.mail
            };
          }else if(consent.role === "Client/Owner"){
            instance.client = {
              name : user.name, 
              address : user.address,
              phone : user.phone,
              mail : user.mail
            };
          }
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

    instance.user = consent.user;
    instance.title = consent.title;
    instance.role = consent.role;
    instance.address = consent.address;
    instance.status = consent.status;
    if(consent.status)
        instance.submitted = false;
    instance.councilRef = consent.councilRef;
    instance.lawfully = consent.lawfully;
    instance.newUse = consent.newUse;
    instance.numberPeople = consent.numberPeople;
    instance.old = consent.old;
    instance.buildingWork = consent.buildingWork;
    instance.valuation = consent.valuation;
    instance.legalDescription = consent.legalDescription;

    instance.agent = consent.agent;
    instance.contact = consent.contact;
    instance.client = consent.client;
    instance.people = consent.people;
    instance.lbp = consent.lbp;

    instance.buildingInfo = consent.buildingInfo;
    instance.project = consent.project;
    instance.people = consent.people;
    instance.doc = consent.doc;
    instance.more = consent.more;
    instance.workingDays = consent.workingDays;
    instance.notifications = consent.notifications;

    instance.save(function(err,instance){
      if(err){
        console.log(err);
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


/*
* Get submissions list
*/
exports.getSubmissions = function(callback){
  db.on('error', console.error.bind(console, 'connection error:'));

  var ConsentModel = mongoose.model('Consent', schemas.consentSchema);
  ConsentModel.find({ status: 'submitted' }, {_id : 1}, function(err, list){
    if(!err){
      console.log(list);
      callback(list);
    }
    else
      return console.log("No list : "+ err);
  });
}

/*
* Get submission by ID
*/
exports.getSubmission = function(id, callback){
  db.on('error', console.error.bind(console, 'connection error:'));

  var ConsentModel = mongoose.model('Consent', schemas.consentSchema);
  ConsentModel.findOne({ submitted: false, _id: id}, function(err, submission){
    if(!err){
      callback(submission);
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

  var instance = new ConsentModel();
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
  db.once('error', console.error.bind(console, 'connection error:'));

  var ConsentModel = mongoose.model('Consent', schemas.consentSchema);
  var instance = new ConsentModel();
  var obj = {
    url : doc.url,
    name : doc.name
  };
  console.log(obj);
  ConsentModel.findOne({ _id: doc.idUser }, function(err, consent){
    if(!err && consent){
    //console.log(consent);
    consent.doc.push(obj);
    consent.save();
    callback(200);
  }
  else{
    if (err) console.log(err);
  }
});
}

exports.addCompliance = function(doc, callback){
  db.once('error', console.error.bind(console, 'connection error:'));

  var ConsentModel = mongoose.model('Consent', schemas.consentSchema);
  var instance = new ConsentModel();
  var obj = {
    url : doc.url,
    name : doc.name,
    clause : doc.clause
  };
  ConsentModel.findOne({ _id: doc.idUser }, function(err, consent){
    if(!err && consent){
      consent.compliance.push(obj);
      consent.save();
      callback(201);
    }
    else{
      if (err) console.log(err);
    }
  });
}


exports.addRfc = function(id, rfc, callback){
  db.once('error', console.error.bind(console, 'connection error:'));

  var ConsentModel = mongoose.model('Consent', schemas.consentSchema);
  var instance = new ConsentModel();

  ConsentModel.findOne({ _id: id }, function(err, consent){
    if(!err && consent){
      consent.RFI.push(rfc);
      consent.save();
      callback(201); 
    }
    else{
      if (err) console.log(err);
    }
  });
}

exports.addRfi = function(id, rfi, callback){
  db.once('error', console.error.bind(console, 'connection error:'));

  var ConsentModel = mongoose.model('Consent', schemas.consentSchema);
  var instance = new ConsentModel();

  ConsentModel.findOne({ _id: id }, function(err, consent){
    if(!err && consent){
      consent.RFI = rfi;
      consent.save();
      callback(201); 
    }
    else{
      if (err) console.log(err);
    }
  });
}

exports.updateStatus = function(id, status, callback){
  db.once('error', console.error.bind(console, 'connection error:'));

  var ConsentModel = mongoose.model('Consent', schemas.consentSchema);
  var instance = new ConsentModel();

  ConsentModel.findOne({ _id: id }, function(err, consent){
    if(!err && consent){
      console.log(status);
      consent.processing.push(status);
      consent.status = status.status;
      consent.save();
      console.log(consent);
      callback(201); 
    }
    else{
      if (err) console.log(err);
    }
  });
}

/*
* Get RFI 
*/
exports.getRfi = function(id, callback){
  db.on('error', console.error.bind(console, 'connection error:'));

  var ConsentModel = mongoose.model('Consent', schemas.consentSchema);
  ConsentModel.find({_id: id}, {RFI: 1}, function(err, rfi){
    if(!err){
      callback(rfi);
    }
    else
      return console.log("Real error : "+ err);
  });
}

/*
* Get status
*/
exports.getStatus = function(id, callback){
  db.on('error', console.error.bind(console, 'connection error:'));

  var ConsentModel = mongoose.model('Consent', schemas.consentSchema);
  ConsentModel.findOne({_id : id}, function(err, consent){
    if(!err){
      callback(consent.processing);
    }
    else
      return console.log("Real error : "+ err);
  });
}

/*
* Change vetting status  Accepted
*/

exports.submissionAccepted = function(id, callback){
  db.once('error', console.error.bind(console, 'connection error:'));

  var ConsentModel = mongoose.model('Consent', schemas.consentSchema);

  ConsentModel.findOne({ _id: id }, function(err, consent){
    if(!err && consent){
      consent.submitted = true;
      consent.status = "vetting";
      consent.save();
      callback(201); 
    }
    else{
      if (err) console.log(err);
    }
  });
}

/*
* Change vetting status Denied
*/

exports.submissionDenied = function(id, description, callback){
  db.once('error', console.error.bind(console, 'connection error:'));

  var ConsentModel = mongoose.model('Consent', schemas.consentSchema);

  ConsentModel.findOne({ _id: id }, function(err, consent){
    if(!err && consent){
      consent.submitted = false;
      consent.vettingDescription = description;
      consent.save();
      callback(201); 
    }
    else{
      if (err) console.log(err);
    }
  });
}

//module.exports = mongoose.model('User', schemas.userSchema);

