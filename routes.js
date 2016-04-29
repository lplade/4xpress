const APPNAME = "Space Jarl";
var router = express.Router();

module.exports = function (app, passport) {
	
	router.get('/', function (req, res) {
		res.render('index', {title: APPNAME});
	});

	router.get('/login', function (req, res) {
		res.render('login', {message: req.flash('loginMessage')});
	});

//TODO app.post login

	router.get('/signup', function (req, res) {
		res.render('signup', {message: req.flash('signupMessage')});
	});

//TODO app.post signup

//user profile - require auth
	router.get('/users/:user_id', isLoggedIn, function (req, res) {
		//var id = req.params.id;
		res.render('users', {title: APPNAME, uid: user_id});
	});

	router.get('/logout', function (req, res) {
		req.logout();
		res.redirect('/');
	});

//TODO /game - list of games
	router.get('/game', function (req, res) {
		//query and render a list of running games. link into games
	});

//TODO /game/:game_id - the main game interface - require auth
	router.get('/game/:game_id', isLoggedIn, function (req, res) {
		res.render('galaxy', {title: APPNAME, game_id: game_id});
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