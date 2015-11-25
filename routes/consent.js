var services = require('../services/mongooseServices'),
request = require('request'),
documentUrl = 'http://ec2-52-18-99-146.eu-west-1.compute.amazonaws.com';

exports.getConsent = function(req, res){
	services.getConsentById(req.params.id, function(consent){
    if(consent)
     res.json(consent);
   else{
    res.status(404).end("Consent not avalaible");
  }
});
};

exports.getConsents = function(req, res){
  services.getConsents(req.params.id, function(consents){
    if(consents)
     res.json(consents);
   else{
    res.status(404).end("No new consents");
  }
});
};

exports.getSubmissions = function(req, res){
  services.getSubmissions(function(submissionsList){
    if(submissionsList)
     res.json(submissionsList);
   else{
    res.status(404).end("No new consents");
  }
});
};

exports.getSubmission = function(req, res){
  services.getSubmission(req.params.id, function(submission){
    if(submission)
     res.json(submission);
   else{
    res.status(404).end("Consent not avalaible");
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
      buildingWork : req.body.buildingWork,
      valuation : req.body.valuation,
      legalDescription : req.body.legalDescription
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
      contact : req.body.contact,
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
    //console.log(consent);
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
    url : documentUrl +"/consentDocument/" + req.files.file.name,
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
    var doc = {
      url: productArray[i].url,
      name : productArray[i].name
    };
    services.updatedDocument(doc, function(code){
      if(code === 404){
        res.status(code).end("Unable to upload the files");
      }else{
       // console.log(res);
        //res.status(code).end("Document uploaded");
      }
    });
  }

};

exports.addCodeCompliance = function(req, res){
  var doc = {
    url : documentUrl +"/consentDocument/" + req.files.file.name,
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

exports.addRfc = function(req, res){
  var id = req.params.id;
  if(req.body === null) res.status(400).end("Syntax error");
  else{
    services.addRfc(id, req.body.rfc, function(code){
      if(code === 404)
        res.status(code).end("Unable to add this rfc");
      else
        res.status(code).end("Rfc added");
    });
  }
};

exports.addRfi = function(req, res){
  var id = req.params.id;
  if(req.body === null) res.status(400).end("Syntax error");
  else{
    services.addRfi(id, req.body.rfi, function(code){
      if(code === 404)
        res.status(code).end("Unable to add this rfi");
      else
        res.status(code).end("Rfc added");
    });
  }
};

exports.updateStatus = function(req, res){
  var id = req.params.id;
  console.log(req.body);
  if(req.body === null) res.status(400).end("Syntax error");
  else{
    services.updateStatus(id, req.body.status, function(code){
      if(code === 404)
        res.status(code).end("Unable to add this status");
      else
        res.status(code).end("Status added");
    });
  }
};

exports.getRfi = function(req, res){
  services.getRfi(req.params.id, function(rfi){
    if(rfi)
     res.json(rfi);
   else{
    res.status(404).end("RFI not avalaible");
  }
});
};

exports.getStatus = function(req, res){
  services.getStatus(req.params.id, function(status){
    if(status)
     res.json(status);
   else{
    res.status(404).end("Status not avalaible");
  }
});
};

exports.submissionAccepted = function(req, res){
  var id = req.params.id;
  services.submissionAccepted(id, function(code){
    if(code === 404)
      res.status(code).end("Unable to add this status");
    else
      res.status(code).end("Status added");
  });
};

exports.submissionDenied = function(req, res){
  var id = req.params.id;
  if(req.body === null) res.status(400).end("Syntax error");
  else{
    services.submissionDenied(id, req.body.description, function(code){
      if(code === 404)
        res.status(code).end("Unable to add this status");
      else
        res.status(code).end("Status added");
    });
  }
};