/* Display a list of current games */
var APPNAME = "Space Jarl";
var express = require('express');
var router = express.Router();

/* GET game listing. */
router.get('/', function(req, res, next) {
	//TODO code the game list
	res.send('list of games goes here');
});

module.exports = router;
