/* Main landing page for app */
var APPNAME = "Space Jarl";

var express = require('express');
var router = express.Router();
//var app = require('../app.js').app;
var passport = require('../app.js').passport;


/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('index', {title: APPNAME});
});

// =====  Login =====
router.route('/login')
	.get(function (req, res, next) {
		res.render('login', {title: APPNAME});
	})
	.post(function (req, res, next) {
		passport.authenticate('local', {
			successRedirect: '/',
			failureRedirect: '/login'
		})
	});

// ===== Sign out =====
router.route('/signout')
	.get(function (req, res, next) {
		req.logout();
		res.redirect('/');
	});

// ===== Sign up =====
router.route('/createaccount')
	.get(function (req, res, next) {
		res.render('signup', {title: APPNAME, message: req.flash('signupMessage')});
	})
	.post( //pass to passport middleware
		passport.authenticate('local-signup', {
			successRedirect: '/profile', //redirect to private member page
			failureRedirect: '/createaccount',
			failureFlash : true
		})
	);

//Map game map STUB
router.get('/galaxy', function(req, res, next){
	res.render('galaxy', {title: APPNAME});
});

// === Route middleware ===
function isLoggedIn(req, res, next) {
	// if authenticated, carry on
	if (req.isAuthenticated())
		return next();

	//if not, redirect to home? sign up?
	res.redirect('/');
}

module.exports = router;
