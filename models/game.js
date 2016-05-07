var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
var User = require('./user');

// A "player" is a "user" that is assigned to a "game"
// A player could participate in multiple games, so instance a Player for every game
/*var PlayerSchema = Schema({
	_playerId: [{
		type: Schema.Types.ObjectId,
		ref: 'User'
	}],
	//User.Types.ObjectId, // _id from user schema
	newTurnText: {
		//TODO store the instructions for each player's pending moves here
		//for right now, have user enter move as text instructions
	}
});*/
var GameSchema = Schema({
	gameName: String,
	creatorId: User.Types.ObjectId, //id of player that created game
	players: [{
		type: Schema.Types.ObjectId,
		ref: 'Player'
	}],
	dateCreated: { type: Date, default: Date.now },
	currentTurnNumber: Number, //increment this every turn
	dateLastTurnGen: Date,
	nextTurnGenTime: Date, //update this every turn
	maxTurnDuration: Number, //when to generate new turn //TODO figure out intervals
	galaxyData: { 
		//TODO all the data for the map goes in here - yet another Schema?
	}
});

GameSchema.methods.addPlayer = function (userId) {
	User.findById(userId, function(err, docs) {
		var newPlayer = new Player;
	});
};

// Randomly generate the starmap
GameSchema.methods.buildMap = function (gridSize, density) {
	var gridX = 0, gridY = 0;
	for (0; gridX < gridSize; gridX++) {
		for (0; gridY < gridSize; gridY++){
			if( function(){return Math.random()} < density ){
				//TODO generate a star at this coordinate
			}
		}
	}
};

module.exports = mongoose.model('Player', PlayerSchema);
module.exports = mongoose.model('Game', GameSchema);