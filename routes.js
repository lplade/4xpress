var APPNAME = require('./config/globals').APPNAME;
var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('./models/user');
//var Game = require('./models/game');

// Middleware for all routes
router.use(function (req, res, next){
	if (req.user) {
		res.locals = {
			title: APPNAME,
			userLoggedIn: req.user.local.username
			// This is so the footer can change depending on whether the user is logged in or not
		}
	} else {
		res.locals = {
			title: APPNAME
		}
	}
	next();
});

router.get('/', function (req, res) {
	//console.log('req.user=' + req.user); //show me what is in req.user
	res.render('index');
});

router.get('/login', function (req, res) {
	//TODO do we need to make sure user is not already logged in?
	res.render('login', {
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
	res.render('galaxy', {
		game_id: game_id
	});
	//TODO redirect to /game on fail - see GET /user/:user_id
});

router.get('/newgame', isLoggedIn, function(req, res){
	User.find(function (err, userDocs) {
		if (err) {
			return next(err);
		}
		return res.render('newgame', {
			creatingUser: req.user_id,
			users: userDocs,
			error: req.flash('error')
		});
	});
	//TODO need to query and send list of users
	res.render('newgame', {
		creatingUser: req.user._id
	});
});

router.post('/newgame', isLoggedIn, function(req, res){
	//TODO populate fields in game and player collections
	//create the game
	//for each player in the game
	//create a Player

});

// HELPER FUNCTIONS
function isLoggedIn(req, res, next) {
	//if user is authenticated in the session, carry on
	if (req.isAuthenticated()) {
		return next();
	}
	// if they aren't, redirect to... home page?
	res.redirect('/');
}

module.exports = router;