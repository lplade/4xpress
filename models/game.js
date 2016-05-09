var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
var User = require('./user');

var GameSchema = Schema({
	gameName: String,
	_creator: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	players: [{
		user: { // Array of user account references
			type: Schema.Types.ObjectId,
			ref: 'User'
		},
		newMoves: String
		//TODO store the instructions for each player's pending moves here
		//for right now, have user enter move as text instructions
	}],
	dateCreated: {type: Date, default: Date.now},
	currentTurnNumber: Number, //increment this every turn
	dateLastTurnGen: Date,
	nextTurnGenTime: Date, //update this every turn
	newTurnsCronStr: String, //when to generate new turn - format as a cron string //TODO validate format
	galaxyData: {
		//TODO all the data for the map goes in here - yet another Schema?
	}
});

GameSchema.methods.addPlayer = function (userId) {
	User.findById(userId, function (err, docs) {
		var newPlayer = new Player;
	});
};

// Randomly generate the starmap
GameSchema.methods.buildMap = function (gridSize, density) {
	var gridX = 0, gridY = 0;
	for (0; gridX < gridSize; gridX++) {
		for (0; gridY < gridSize; gridY++) {
			if (function () {
					return Math.random()
				} < density) {
				//TODO generate a star at this coordinate
			}
		}
	}
};

module.exports = mongoose.model('Game', GameSchema);