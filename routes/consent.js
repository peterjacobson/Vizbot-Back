var services = require('../services/mongooseServices'),
request = require('request');

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
  else if(!req.body.title || !req.body.role || !req.body.address){
    res.status(400).end("Missing field");
  }else{
    services.getUserById(req.body.user, function(user){
      if(!user)
        res.status(400).end("User unknown :  unable to create a consent");
    });
    var consent = {
      user : req.body.user,
      title : req.body.title,
      role : req.body.role,
      address : req.body.address,
      status : req.body.status,
      councilRef : req.body.councilref,
      lawfullyUse : req.body.lawfullyUse,
      newUse : req.body.newUse,
      numberPeople : req.body.numberPeople,
      old : req.body.old,
      buildingWork : req.body.buildingWork
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

/*
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
*/
exports.modifyConsent = function(req, res){
  var id = req.params.id;
  if(req.body == null) res.status(400).end("Syntax error");
  else{
    var consent = {
      user : req.body.user,
      title : req.body.title,
      role : req.body.role,
      address : req.body.address,
      status : req.body.status,
      councilRef : req.body.councilref,
      lawfullyUse : req.body.lawfullyUse,
      newUse : req.body.newUse,
      numberPeople : req.body.numberPeople,
      old : req.body.old,
      buildingWork : req.body.buildingWork,

      agent : req.body.agent,
      client : req.body.client,
      people : req.body.people,
      lbp : req.body.lbp,

      buildingInfo : req.body.buildingInfo,
      project : req.body.project,
      
      doc : req.body.doc,
      more : req.body.more, 
      workingDays : req.body.workingDays,
      notifications : req.body.notifications,
      RFI : req.body.RFI
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
  var doc = {
    url : "http://localhost:3000/consentDocument/" + req.files.file.name,
    name : req.files.file.originalname,
    idUser : req.params.id
  };
  services.updatedDocument(doc, function(code){
    if(code == 404){
      res.status(code).end("Unable to upload the files");
    }else{
      res.status(code).end("Document uploaded");
    }
  });
  console.log(req.files);
};



exports.addProductSpec = function(req, res){
  var productArray = req.body;
  for (var i = 0; i < productArray.length; i++) {
    var options = {
      url: productArray[i].url,
      headers: {
        'Authorization': 'Basic ZmRMVVFOZ0huNDc3Ong='
      }
    };
    console.log(options);
      request(options, function (error, response, body) {
    var href = response.request.href;
    var res = href.split("/");
    var doc = {
      url : href,
      name : res[res.length - 1],
      idUser : req.params.id
    };

    services.updatedDocument(doc, function(code){
      if(code === 404){
        res.status(code).end("Unable to upload the files");
      }else{
       // console.log(res);
        //res.status(code).end("Document uploaded");
      }
    });
    });
  }

};

exports.addCodeCompliance = function(req, res){
  console.log(req.params.clause);
  var doc = {
    url : "http://localhost:3000/consentDocument/" + req.files.file.name,
    name : req.files.file.originalname,
    idUser : req.params.id,
    clause : req.params.clause
  };
  services.addCompliance(doc, function(code){
    if(code == 404){
      res.status(code).end("Unable to upload the files");
    }else{
      res.status(code).end("Document uploaded");
    }
  });
  res.status(200).end("");
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

