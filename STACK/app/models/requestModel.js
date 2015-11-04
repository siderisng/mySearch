/////////////////////////////////////////////////////////////
//////////AUTHORS :   chocof (https://github.com/chocof)/////
//////////File :  app/api/requestModel.js 		    /////////
/////////////////////////////////////////////////////////////


//Basic Request Model
var mongoose = require('mongoose');

var requestSchema = mongoose.Schema({
	country 	: String, //country in which request was made
	city    	: String, //city in which request was made
	location 	: { longitude : Number, latitude : Number },//location in which request was made
	query		  : String, //what user searched for
	//a list of  objects google responsed with
	googleResults : [{name : String, facility : String, location : { longitude : Number, latitude : Number }}],	
	
	///////not to be used in this project yet////////////
	userChoice	  :	String, //user choice
	userRating	  : Number, //user rating 
	stillActive   : {type : boolean, default : "yes"} // Has user rated or choose something?
	///////not to be used in this project yet////////////

});


module.exports = mongoose.model('Request', requestSchema);
