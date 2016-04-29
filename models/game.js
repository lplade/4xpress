var mongoose = require('mongoose');

var PlayerSchema = new mongoose.Schema({
	_playerId: Schema.Types.ObjectId, // _id from user schema
	newTurn: {
		//TODO store the instructions for each player's pending moves here
	}
});
var GameSchema = new mongoose.Schema({
	creatorId: Schema.Types.ObjectId, //id of player that created game
	players: [PlayerSchema],
	dateCreated: { type: Date, default: Date.now },
	dateLastTurnGen: Date,
	maxTurnDuration: Number, //when to generate new turn //TODO figure out intervals
	galaxyData: {
		//TODO all the data for the map goes in here
	}
});


module.exports = mongoose.model('Game', GameSchema);