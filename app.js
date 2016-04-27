var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy;
var parseurl = require('parseurl');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);

var app = express();
app.use(logger('dev'));

// connect to session db
var store = new MongoDBStore(
	{
		uri:'mongodb://localhost:27017/4x_session_db',
		collection:'mySessions'
	}
);

store.on('error', function(error){
	assert.ifError(error);
	assert.ok(false);
});

app.use(session({
	secret: "T0T4L_P4WN4G3", //TODO replace with real random number
	store: store,
	resave: false, //stop warnings
	saveUnitialized: false //stop warnings
}));

// ** Routers **
var routes = require('./routes/index');
var gamelist = require('./routes/gamelist');
var users = require('./routes/users');




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/gamelist', gamelist);
app.use('/users', users);

//Passport-local
passport.use(new LocalStrategy(
	function(username, password, done) {
		User.findOne({ username: username }, function (err, user) {
			if (err) { return done(err); }
			if (!user) {
				return done(null, false, { message: 'Incorrect username.' });
			}
			if (!user.validPassword(password)) {
				return done(null, false, { message: 'Incorrect password.' });
			}
			return done(null, user);
		});
	}
));

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


module.exports = app;
