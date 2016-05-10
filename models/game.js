var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
var User = require('./user');

var chance = require('chance').Chance();

var GameSchema = Schema({
	gameName: {
		type: String,
		unique: true,
		required: true,
		lowercase: true,
		trim: true
	},
	creatorId: {
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
	galaxyData: [{
		name: String,
		coordinates: [Number], // [x, y]
		starClass: String,
		mainWorld: {
			biome: Number,
			minerals: Number
		},
		starBase: String, //starbase type
		owner: {
			type: Schema.Types.ObjectId,
			ref: 'User'
		}
	}]
});

// GameSchema.methods.addPlayer = function (userId) {
// 	User.findById(userId, function (err, docs) {
// 		var newPlayer = new Player;
// 	});
// };

// Randomly generate the starmap
GameSchema.methods.buildMap = function (gridSize, density, callback) {
	var gridY = 0;
	var galData = [];
	for (gridY; gridY < gridSize; gridY++) {
		//console.log('row ' + gridY);
		var gridX = 0;
		for (gridX; gridX < gridSize; gridX++) {
			//console.log('column ' + gridX);
			if (chance.bool({likelihood: density})) {
				// TODO pick name from imported list and test for unique
				var name = chance.city();
				var coordinates = [gridX, gridY];
				var starClass = chance.pickone(['G', 'K', 'F', 'M', 'M']);
				//TODO define star stuff externally
				var biome = chance.d100();
				var minerals = chance.d100();
				var mainworld = {"biome": biome, "minerals": minerals};
				var sector = {
					"name": name,
					"coordinates": coordinates,
					"starClass": starClass,
					"mainWorld": mainworld
				};
				galData.push(sector);
				process.stdout.write('*'); //make a little map on the console
				//console.log('sector');
			} else {
				//console.log('empty');
				process.stdout.write('.');
			}
		}
		process.stdout.write('\n');
	}
	this.galaxyData = galData;
	this.save(callback);
};

module.exports = mongoose.model('Game', GameSchema);