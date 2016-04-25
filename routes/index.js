/* Main landing page for app */
var APPNAME = "Space Jarl";

var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('index', {title: APPNAME});
});

// Login
router.route('/login')
	.get(function (req, res, next) {
		//TODO login form
	})
	.post(function (req, res, next) {
		//TODO login
	});

//Sign up
router.route('/createaccount')
	.get(function (req, res, next) {
		//TODO create account form
	})
	.post(function (req, res, next) {
		//TODO create account
	});

module.exports = router;
