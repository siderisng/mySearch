/////////////////////////////////////////////////////////////
//////////AUTHORS :   chocof (https://github.com/chocof)/////
//////////File :  app/api/requestModel.js 		    /////////
/////////////////////////////////////////////////////////////


//Basic User Model
var mongoose = require('mongoose');

var requestSchema = mongoose.Schema({
	country 	: String,
	city    	: String,
	location 	: { longitude : Number, latitude : Number },
	query		  : String,
	googleResults : [{name : String, facility : String, location : { longitude : Number, latitude : Number }}],	
	userChoice	  :	String,
	userRating	  : Number,
	stillActive   : {type : boolean, default : "yes"}


});


module.exports = mongoose.model('Request', requestSchema);
