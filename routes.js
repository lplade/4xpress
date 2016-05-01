var APPNAME = require('./config/globals').APPNAME;
var express = require('express');
var router = express.Router();
var passport = require('passport');

module.exports = function (app, passport) {
	
	router.get('/', function (req, res) {
		res.render('index', {title: APPNAME});
	});

	router.get('/login', function (req, res) {
		res.render('login', {title: APPNAME, message: req.flash('loginMessage')});
	});

//TODO app.post login

	router.get('/signup', function (req, res) {
		res.render('signup', {title: APPNAME, message: req.flash('signupMessage')});
	});

	router.post('/signup', passport.authenticate('local-signup',{
		successRedirect: '/',
		failureRedirect: '/signup',
		failureFlash: true
	}));

	router.get('/users', function(req, res) {
		res.render('users', {title: APPNAME});
	});
//user profile - require auth
	router.get('/users/:user_id', isLoggedIn, function (req, res) {
		//var id = req.params.id;
		//TODO query for user info, display user profile
		res.render('userX', {title: APPNAME, uid: user_id});
		//TODO redirect to /users on fail
	});

	router.get('/logout', function (req, res) {
		req.logout();
		res.redirect('/');
	});

//TODO /game - list of games
	router.get('/games', function (req, res) {
		//query and render a list of running games. link into games
	});

//TODO /game/:game_id - the main game interface - require auth
	router.get('/games/:game_id', isLoggedIn, function (req, res) {
		//TODO query all necessary bits of game, pass to renderer
		res.render('galaxy', {title: APPNAME, game_id: game_id});
		//TODO redirect to /game on fail
	});

	app.use('/', router);

};

function isLoggedIn(req, res, next) {

	//if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't, redirect to... home page?
	res.redirect('/');
}