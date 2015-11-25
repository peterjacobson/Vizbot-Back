var services = require('../services/mongooseServices');

exports.getUser = function(req, res){
	services.getUserById(req.params.id, function(user){
		if(user)
			res.json(user);
		else{
			res.status(404).end("User not avalaible");
		}
	});
};

exports.createUser = function(req, res){
	if(req.body == null) res.status(400).end("Syntax error");
	else if(!req.body.name || !req.body.mail || !req.body.pwd || !req.body.address){
		res.status(400).end("Missing field");
	}
	else{
		var user = {
			name : req.body.name,
			mail : req.body.mail,
			pwd : req.body.pwd,
			address : req.body.address
		}
		services.createUser(user, function(code, id){
			if(code == 201){
				res.setHeader("url", req.url);
				res.setHeader("id", id);
				res.status(code).end("User added");
			}
			else if(code == 409)
				res.status(code).end("Conflict : Unable to add User");
		});
	}
};

exports.modifyUser = function(req, res){
	var id = req.params.id;
	if(req.body == null) res.status(400).end("Syntax error");
	else{
		var user = {
			name : req.body.name,
			mail : req.body.mail,
			pwd : req.body.pwd,
			avatar : req.body.avatar,
			pos : [{
				lat : req.body.lat,
				long : req.body.long
			}]
		}
		services.modifyUser(id,user,function(code){
			if(code == 404)
				res.status(code).end("Unable to modify user");
			else
				res.status(code).end("User modified");
		});
	}
};

exports.deleteUser = function(req, res){
	if(!req.params.id) res.status(400).end("Syntax error");
	services.deleteUser(req.params.id, function(code){
		if(code == 204)
			res.status(code).end("User deleted");
		else
			res.status(code).end("Unable to delete");
	});
};

exports.logIn = function(req, res){
	if(req.body.mail && req.body.pwd){
		services.logIn(req.body.mail, req.body.pwd, function(id, code){
			if(code == 404) res.status(code).end("Nonexistent user");
			else{
				res.setHeader("id", id);
				res.status(code).end();
			}
		});
	} else res.status(400).end('{"error" : "syntax error"}');
};

exports.getConsents = function(req, res){
	services.getConsentsByUser(req.params.id, function(consents){
		if(consents){
			console.log("consent");
			res.json(consents);
		}
		else
			res.status(404).end("No consents avalaible");
	});
};