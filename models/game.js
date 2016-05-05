var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
var User = require('./user');

// A "player" is a "user" that is assigned to a "game"
var PlayerSchema = Schema({
	_playerId: [{
		type: Schema.Types.ObjectId,
		ref: 'User'
	}],
	//User.Types.ObjectId, // _id from user schema
	newTurn: {
		//TODO store the instructions for each player's pending moves here
	}
});
var GameSchema = Schema({
	creatorId: User.Types.ObjectId, //id of player that created game
	players: [{
		type: Schema.Types.ObjectId,
		ref: 'Player'
	}],
	dateCreated: { type: Date, default: Date.now },
	dateLastTurnGen: Date,
	maxTurnDuration: Number, //when to generate new turn //TODO figure out intervals
	galaxyData: { 
		//TODO all the data for the map goes in here - yet another Schema?
	}
});

module.exports = mongoose.model('Player', PlayerSchema);
module.exports = mongoose.model('Game', GameSchema);