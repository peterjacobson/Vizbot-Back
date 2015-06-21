var services = require('../services/mongooseServices');

exports.getConsent = function(req, res){
	services.getConsentById(req.params.id, function(consent){
    if(consent)
     res.json(consent);
    else{
      res.status(404).end("User not avalaible");
    }
  });
};

exports.createConsent = function(req, res){
  if(req.body == null) res.status(400).end("Syntax error");
  else if(!req.body.title || !req.body.client || !req.body.address){
  res.status(400).end("Missing field");
  }else{
    services.getUserById(req.body.user, function(user){
      if(!user)
        res.status(400).end("User unknown :  unable to create a consent");
    });
    var consent = {
      user : req.body.user,
      title : req.body.title,
      client : req.body.client,
      address : req.body.address,
      owner : req.body.owner,
      status : req.body.status
  };
  services.createConsent(consent, function(code, id, instance){
    if(code == 201){
      res.setHeader("url", req.url);
      res.setHeader("id", id);
      res.json(instance);
      res.status(code).end("Consent added");
    }
    else if(code == 409)
      res.status(code).end("Conflict : Unable to add Note");
  });
  }
};

exports.modifyConsent = function(req, res){
  var id = req.params.id;
  if(req.body == null) res.status(400).end("Syntax error");
  else{
    var consent = {
      user : req.body.user,
      title : req.body.title,
      client : req.body.client,
      address : req.body.address,
      owner : req.body.owner,
      status : req.body.status,
      councilRef : req.body.councilRef,
      buildingInfo : req.body.buildingInfo,
      project : req.body.project,
      people : req.body.people,
      doc : req.body.doc,
      more : req.body.more, 
      workingDays : req.body.workingDays,
      notifications : req.body.notifications
  };
  console.log(consent);
  services.modifyConsent(id, consent, function(code, consent){
    if(code == 200){
      res.json(consent);
      res.status(code).end("Consent updated");
      console.log(res);
    }
    else if(code == 404)
      res.status(code).end("Conflict : Unable to Update the Consent");
  });
  }
  
};

exports.deleteConsent = function(req, res){

};

exports.addBuildingInfo = function(req, res){
  var id = req.params.id;
  if(req.body == null) res.status(400).end("Syntax error");
  else{
    var buildingInfo = {
      client : String,
      description : String, 
      location : String, 
      area : String, 
      levels : Number
    }
    services.addBuildingInfo(id,buildingInfo,function(code){
      if(code == 404)
        res.status(code).end("Unable to modify user");
      else
        res.status(code).end("User modified");
    });
  }
};

exports.addDocument = function(req, res){
  var id = req.params.id;
  if(req.body == null) res.status(400).end("Syntax error");
  else{
    var documents = {
      client : String,
      description : String, 
      location : String, 
      area : String, 
      levels : Number
    }
    services.addDocument(id,documents,function(code){
      if(code == 404)
        res.status(code).end("Unable to modify user");
      else
        res.status(code).end("User modified");
    });
  }
};

exports.addProject = function(req, res){
  var id = req.params.id;
  if(req.body == null) res.status(400).end("Syntax error");
  else{
    var project = {
      client : String,
      description : String, 
      location : String, 
      area : String, 
      levels : Number
    }
    services.addProject(id,project,function(code){
      if(code == 404)
        res.status(code).end("Unable to modify user");
      else
        res.status(code).end("User modified");
    });
  }
};

exports.addPeople = function(req, res){
  var id = req.params.id;
  if(req.body == null) res.status(400).end("Syntax error");
  else{
    var people = {
      client : String,
      description : String, 
      location : String, 
      area : String, 
      levels : Number
    }
    services.addPeople(id,people,function(code){
      if(code == 404)
        res.status(code).end("Unable to modify user");
      else
        res.status(code).end("User modified");
    });
  }
};

exports.addMore = function(req, res){
  var id = req.params.id;
  if(req.body == null) res.status(400).end("Syntax error");
  else{
    var more = {
      client : String,
      description : String, 
      location : String, 
      area : String, 
      levels : Number
    }
    services.addMore(id,more,function(code){
      if(code == 404)
        res.status(code).end("Unable to modify user");
      else
        res.status(code).end("User modified");
    });
  }
};

