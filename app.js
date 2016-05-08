//app-wide constants
const APPNAME = require('./config/globals').APPNAME;
const PORT = require('./config/globals').PORT;

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

var routes = require('./routes');

var app = express();

// set up database connection
var configDB = require('./config/database');
mongoose.connect(configDB.url);
//var User = require('./models/user');
//var Game = require('./models/game');

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
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

// Set up static files
app.use(express.static(path.join(__dirname + '/public')));

//set up passport
app.use(session({
	secret: 'T0T4L_PWN4G3',
	resave: true,
	saveUninitialized: true
}));
// Include passport authentication function
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); //use connect-flash for flash messages stored

/* end middleware */

/*
 === ROUTERS ===
 */

//require('./routes')(app, passport);
app.use('/', routes);
/* end routers */

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function (err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});

app.listen(PORT, function () {
	console.log('Listening on port ' + PORT);
});