var services = require('../services/mongooseServices');

exports.getConsent = function(req, res){
	res.status(404).end("First test");
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
    address : req.body.address
  }
  services.createConsent(consent, function(code, id){
    if(code == 201){
      res.setHeader("url", req.url);
      res.setHeader("id", id);
      res.status(code).end("Consent added");
    }
    else if(code == 409)
      res.status(code).end("Conflict : Unable to add Note");
  });
  }
};

exports.modifyConsent = function(req, res){
  res.status(404).end("First test");
};

exports.deleteConsent = function(req, res){
  res.status(404).end("First test");
};

