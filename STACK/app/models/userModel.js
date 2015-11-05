/////////////////////////////////////////////////////////////
//////////AUTHORS :   chocof (https://github.com/chocof)/////
//////////File :  app/api/userModel.js 		        /////////
/////////////////////////////////////////////////////////////

var crypto = require('crypto');


//Basic User Model
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;


var UserSchema = Schema({
	
	email 				: String,  ///users' unique email
	password  			: String,  ///Users' password... will later be md5-hashed
	name				: String,  ///Users' name
	surname				: String,  ///Users's surname
	username			: String,  ///User's username
	age					: Number,  ///User's age
	onPhoneSession		: Boolean, ///Set to true when user is logged in phone
	sessionCode			: String,   ///Phone's session code 
	requestHistory      : [ Schema.Types.ObjectId ], //A list of all requests this user is linked to
	hasActiveRequest    : { yes : {type : Boolean, default : false}, current : { type: Schema.Types.ObjectId, ref: 'Request' }}
});



//Create md5 hashing with crypto
UserSchema.methods.generateHash = function(password) {
    var hash = crypto.createHash('md5'); //used for signup
    return hash.update(password).digest('hex');
};

// check if password is valid
UserSchema.methods.validPassword = function(password) {
    var hash = crypto.createHash('md5'); //used for login	
	var input = hash.update(password).digest('hex')
	//compare to hashed password
    return (input === this.password);
};

module.exports = mongoose.model('User', UserSchema);
