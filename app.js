var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var morgan = require('morgan');

var app = express();

// view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//const in case we get bored with name
const APPNAME = "Space Jarl";

/*
=== MIDDLEWARE ===
*/

// development-level logging
app.use(morgan('dev'));
//TODO change to 'combined' for production

//basic body parsing stuff
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Set up static files
app.use(express.static(path.join(__dirname + '/public')));
console.log(path.join(__dirname + '/public'));





/* end middleware */

/*
=== ROUTERS ===
*/
app.get('/', function (req, res){
	res.render('index', {title: APPNAME});
});

app.get('/users/:id', function (req, res){
	var id = req.params.id;
	res.render('users', {title : APPNAME, uid: id });
});

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

app.listen(3000, function() {
	console.log('Listening on port 3000');
});



module.exports = app;