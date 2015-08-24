var express = require('express'),

	morgan = require('morgan'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	errorhandler = require('errorhandler'),
	http = require('http'),
	multer  = require('multer'),
	path = require('path'),
	static = require('node-static'),
	request = require('request'),
	passport = require('passport'),
	authController = require('./routes/auth'),
 
	user = require('./routes/user'),
	consent = require('./routes/consent'),
	mongo = require('./services/mongooseServices'),

	app = express();

app.use(multer({ dest: './assets/consentDocument'}));
app.set('port', process.env.PORT || 8080);
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(express.static('assets'));
// Use the passport package in our application
app.use(passport.initialize());


app.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type,Authorization,Cache-Control");
	res.header("Access-Control-Expose-Headers", "id");
	next();
});


app.get('/users/:id',user.getUser);
app.put('/users',authController.isAuthenticated, user.logIn);
app.post('/users', user.createUser);
app.put('/users/:id', user.modifyUser);
app.delete('/users/:id', user.deleteUser);

app.get('/users/:id/consents', user.getConsents);
app.get('/consents/:id', authController.isAuthenticated, consent.getConsent);
app.post('/consents', consent.createConsent);
app.post('/consents/:id' ,consent.modifyConsent);
app.post('/consents/:id/document', consent.addDocument);
app.post('/consents/:id/productspec', consent.addProductSpec);
app.post('/consents/:id/codeCompliance/:clause', consent.addCodeCompliance);

app.get('/submissions',authController.isAuthenticated, consent.getSubmissions);
app.get('/submissions/:id',authController.isAuthenticated , consent.getSubmission);

app.post('/submissions/:id/accepted',authController.isAuthenticated ,consent.submissionAccepted);
app.post('/submissions/:id/denied', authController.isAuthenticated, consent.submissionDenied);

//app.get('/consents', consent.getConsents);
app.post('/consents/:id/rfc', authController.isAuthenticated, consent.addRfc);
app.post('/consents/:id/rfi', authController.isAuthenticated, consent.addRfi);
app.post('/consents/:id/status',authController.isAuthenticated, consent.updateStatus);

app.get('/consents/:id/rfi',authController.isAuthenticated, consent.getRfi);
app.get('/consents/:id/status',authController.isAuthenticated, consent.getStatus);

//app.post('/consents/:id/submitted', consent.consentSubmitted);

app.post('/consents/:id/productspec',authController.isAuthenticated, consent.addProductSpec);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Port ' + app.get('port'));
});
