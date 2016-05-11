var APPNAME = require('./config/globals').APPNAME;
var TZ = require('./config/globals').TZ;
var express = require('express');
var router = express.Router();
var passport = require('passport');
var moment = require('moment-timezone');
var removeValue = require('remove-value');
Array.prototype.remove = removeValue;

var User = require('./models/user');
var Game = require('./models/game');

// Middleware for all routes
router.use(function (req, res, next) {
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
	if (req.params.user_id != req.user._id) {
		console.log('User attempting to access wrong user page');
		//TODO can we flash a warning to user after redirecting?
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
router.get('/games', function (req, res, next) {
	Game.find(function (err, gameDocs) {
		if (err) {
			return next(err);
		}

		//TODO calculate how much time until turn - get nextTurnGenTime setter in place
		//var timeRemaining = gameDocs.nextTurnGenTime - Date.now();
		//var timeRemainingStr = moment(currentTime).tz(TZ).format('Y-MMM-DD HH:mm:ss ZZ');

		var timeRemainingStr = "YYYY-MM-DD HH:MM:SS CDT";
		
		return res.render('games', {
			games: gameDocs,
			//numPlayers: numPlayers,
			timeRemaining: timeRemainingStr,
			error: req.flash('error')
		})
	});
});

//TODO /game/:game_id - the main game interface - require auth
router.get('/games/:game_id', function (req, res) {
	//TODO query all necessary bits of game, pass to renderer
	res.render('gameX', {
		//game_id: game_id
	});
	//TODO redirect to /game on fail - see GET /user/:user_id
});

router.get('/newgame', isLoggedIn, function (req, res) {
	User.find(function (err, userDocs) {
		if (err) {
			return next(err);
		}
		//var currentTime = Date.now();
		//var currentTimeStr = moment(currentTime).tz(TZ).format('Y-MMM-DD HH:mm:ss ZZ');
		return res.render('newgame', {
			creatingUser: req.user,
			users: userDocs,
			error: req.flash('error')
		});
	});
});

router.post('/newgame', isLoggedIn, function (req, res, next) {
	//TODO populate fields in game and player collections
	//console.log(req.body);
//	res.json(req.body);
// Form returns this sort of data:
	/*	{ creatorId: '572bb7f586f369725e0f751d',
	 gamename: 'test',
	 player1: '572bb7f586f369725e0f751d',
	 player2: '572bb82386f369725e0f751e',
	 player3: 'NOPLAYER',
	 player4: 'NOPLAYER',
	 gridSize: '8',
	 density: '0.3333333',
	 cronStr: '0 0 0 1/1 * ? *' }*/

	//Turn player ids from form data into array
	//TODO data validation (duplicate players, enough players)
	var playerIds = [req.body.player1, req.body.player2, req.body.player3, req.body.player4];
	//console.log('playerids:' + playerIds);
	playerIds.remove('NOPLAYER'); //remove-value library
	//console.log('trimmed playerids:' + playerIds);
	var players = [];
	for (var index=0; index<playerIds.length; index++) {
		//console.log('Pl' + index +"=" + playerIds[index]);
		players.push({
			user: playerIds[index],
			newMove: ""
		});
	}
	//console.log("PLAYERS:");
	//console.log(players);
	if (players.length == 0) next(err);
	//populate() these?

	//turn duration
	var dateCreated = Date.now();
	var currentTurnNumber = 1;
	//leave nextTurnGenTime undefined for now?
	var newTurnsCronStr = req.body.cronStr;

	//then build the json object and save it to Game
	var newGame = new Game({
		gameName: req.body.gameName,
		creatorId: req.body.creatorId,
		players: players,
		dateCreated: dateCreated,
		currentTurnNumber: currentTurnNumber,
		newTurnsCronStr: newTurnsCronStr
	});

	var gridSize = req.body.gridSize;
	var density = req.body.density; // formatted for chance module

	//console.log('NEWGAME before galgen:');
	//console.log(newGame);

	//Generate the starmap
	newGame.buildMap(gridSize, density, function (err, galaxy) {
		// if (err) {
		// 	console.log('Trouble generating galaxy');
		// 	return next(err);
		// }
		console.log(galaxy);
	});


	newGame.save(function (err) {
		//Handle validation errors
		if (err) {
			if (err.name = "ValidationError") {
				req.flash('error', 'Invalid data');
				return res.redirect('/newgame');
			}
			//Handle duplication errors
			if (err.code == 11000) {
				req.flash('error', 'THING already exists');
				return res.redirect('/newgame');
			}
			//Other error
			return next(err);
		}
		//If no error, game created. Redirect...
		res.status(201); //HTTP "Created"
		return res.redirect('/games');
		//return res.json(newGame);
	});
});

//TODO UI prototype - delete this
router.get('/galtest', function (req, res) {
	res.render('galaxy');
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