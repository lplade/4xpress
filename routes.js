var APPNAME = require('./config/globals').APPNAME;
var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('./models/user');
//var Game = require('./models/game');


router.get('/', function (req, res) {
	console.log('req.user=' + req.user); //show me what is in req.user
	res.render('index', {
		title: APPNAME
	});
});

router.get('/login', function (req, res) {
	res.render('login', {
		title: APPNAME,
		message: req.flash('loginMessage')
	});
});
router.post('/login', passport.authenticate('local-login', {
	successRedirect: '/users', // + req.user.id, Custom callback needed?
	failureRedirect: '/login',
	failureFlash: true
}));

//TODO app.post login

router.get('/signup', function (req, res) {
	res.render('signup', {
		title: APPNAME,
		message: req.flash('signupMessage')
	});
});

router.post('/signup', passport.authenticate('local-signup', {
	successRedirect: '/users', // + req.user.id,
	failureRedirect: '/signup',
	failureFlash: true
}));

router.get('/users', function (req, res, next) {
	// Find all the users, display their usernames and links to their pages
	User.find(function (err, userDocs) {
		if (err) {
			return next(err);
		}
		return res.render('users', {
			users: userDocs,
			title: APPNAME,
			error: req.flash('error')
		});
	});
});

//user profile - require auth
router.get('/users/:user_id', isLoggedIn, function (req, res, next) {
	//var id = req.params.id;
	if (req.params.user_id != req.user._id) {
		console.log('User attempting to access wrong user page');
		return res.redirect('/users');
	}
	User.findById(req.params.user_id, function (err, userDocs) {
		if (err) {
			//res.send(err);
			return next(err);
			//TODO redirect to /users on fail
		}
		//TODO only show to matching authenticated user
		console.log('Returned ' + userDocs);
		return res.render('userX', {
			userData: userDocs,
			title: APPNAME,
			error: req.flash('error')
			//TODO need to pass game info too
		});
	});
});

router.get('/logout', function (req, res) {
	req.logout();
	res.redirect('/');
});

//TODO /game - list of games
router.get('/games', function (req, res) {
	/*	Game.find(function(err, gameDocs){
	 if (err) {
	 return next(err);
	 }
	 return res.render('games')
	 });*/
	//query and render a list of running games. link into games
});

//TODO /game/:game_id - the main game interface - require auth
router.get('/games/:game_id', isLoggedIn, function (req, res) {
	//TODO query all necessary bits of game, pass to renderer
	res.render('galaxy', {title: APPNAME, game_id: game_id});
	//TODO redirect to /game on fail
});


function isLoggedIn(req, res, next) {
	//if user is authenticated in the session, carry on
	if (req.isAuthenticated()) {
		return next();
	}
	// if they aren't, redirect to... home page?
	res.redirect('/');
}

module.exports = router;