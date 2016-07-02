/////////////////////////////////////////////////////////////
//////////AUTHORS :   chocof (https://github.com/chocof)/////
//////////File :  app/api/msaUser.js 		        /////////
/////////////////////////////////////////////////////////////

var crypto = require('crypto');

//Basic User Model
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;


var msaUserSchema = Schema({
	
	email 				: String,  ///users' unique email
	password  			: String,  ///Users' password... will later be md5-hashed
	name				: String,  ///Users' name
	surname				: String,  ///Users's surname
	username			: String,  ///User's username
	age					: Number,  ///User's age
	expDate				: Date,    ///Date where happiness is over
	isValid				: Boolean, ///Set to true when user has paid		
	/**
	* For future update we will add user data that let him
	* make purchases in store for info etc.
	* For now everything is free
	*/
});



//Create md5 hashing with crypto
msaUserSchema.methods.generateHash = function(password) {
    var hash = crypto.createHash('md5'); //used for signup
    return hash.update(password).digest('hex');
};

// check if password is valid
msaUserSchema.methods.validPassword = function(password) {
    var hash = crypto.createHash('md5'); //used for login	
	var input = hash.update(password).digest('hex')
	//compare to hashed password
    return (input === this.password);
};

module.exports = mongoose.model('msaUser', msaUserSchema);
