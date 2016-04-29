var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new mongoose.Schema({
	username: {
		type: String,
		unique: true,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	email: {
		type: String,
		unique: true,
		required: true
	}
});

// Password hashing
// Execute before each user.save() call
UserSchema.pre('save', function (callback) {
	var user = this;

	// Break out if password hasn't changed
	if (!user.isModified('password')) return callback();

	// Password changed so we need to hash it
	bcrypt.genSalt(5, function (err, salt) {
		if (err) return callback(err);

		bcrypt.hash(user.password, salt, null, function (err, hash) {
			if (err) return callback(err);
			user.password = hash;
			callback();
		});
	});
});

module.exports = mongoose.model('User', UserSchema);