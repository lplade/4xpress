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
		//TODO validate for valid email address
		type: String,
		unique: true
		//, required: true
	},
	signUpDate : {
		type: Date,
		default : Date.now() 
	}
});

/*// Password hashing
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
 });*/

UserSchema.methods.generateHash = function (password) {
	//Create salted hash of password by hashing plaintext password
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

UserSchema.methods.validPassword = function (password) {
	//Hash entered password, compare with stored hash
	return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', UserSchema);