var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new mongoose.Schema({
	local: { //local authentication fields
		username: {
			type: String,
			unique: true,
			required: true,
			lowercase: true, //store lowercase best option?
			trim: true
		},
		password: {
			type: String,
			required: true
		}
	},
	email: {
		//TODO validate for valid email address
		type: String,
		lowercase: true
		//, unique: true //need validation logic before setting this or get mysterious errors
		//, required: true
	},
	signUpDate : {
		type: Date,
		default : Date.now() 
	}
});

UserSchema.methods.generateHash = function (password) {
	//Create salted hash of password by hashing plaintext password
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

UserSchema.methods.validPassword = function (password) {
	//Hash entered password, compare with stored hash
	return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', UserSchema);