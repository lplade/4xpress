//app-wide constants
const APPNAME = "Space Jarl";
const PORT = process.env.PORT || 3000;

//npm dependencies
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');

var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var app = express();

// set up database connection
var configDB = require('./config/database');
mongoose.connect(configDB.url);
var User = require('./models/user');

//require('./config/passport')(passport);

// view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

/*
=== MIDDLEWARE ===
*/

// development-level logging
app.use(morgan('dev'));
//TODO change to 'combined' for production

//basic body parsing stuff
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set up static files
app.use(express.static(path.join(__dirname + '/public')));

//set up passport
app.use(session({secret: 'T0T4L_PWN4G3'}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); //use connect-flash for flash messages stored

//TODO move this into router
function isLoggedIn(req, res, next) {
	
	//if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();
	
	// if they aren't, redirect to... home page?
	res.redirect('/');
}

/* end middleware */

/*
=== ROUTERS ===
*/
app.get('/', function (req, res){
	res.render('index', {title: APPNAME});
});

app.get('/login', function(req, res){
	res.render('login', { message: req.flash('loginMessage')});
});

//TODO app.post login

app.get('/signup', function(req,res){
	res.render('signup', {message: req.flash('signupMessage')});
});

//TODO app.post signup

//user profile - require auth
app.get('/users/:user_id', isLoggedIn, function (req, res){
	var id = req.params.id;
	res.render('users', {title : APPNAME, uid: id });
});

app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

//TODO /game - list of games

//TODO /game/:game_id - the main game interface - require auth

/* end routers */

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});

app.listen(PORT, function() {
	console.log('Listening on port ' + PORT);
});