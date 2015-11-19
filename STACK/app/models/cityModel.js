/////////////////////////////////////////////////////////////
//////////AUTHORS :   chocof (https://github.com/chocof)/////
//////////File :  app/api/cityModel.js 		    /////////
/////////////////////////////////////////////////////////////


//City Model //unique southpark reference
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var requestSchema = mongoose.Schema({
	name 	: String, //the name of the city
	//city's location and NE and SW borders
	location : {
		northeast : { 
			longitude : {type : String, default : -1},
			latitude : {type : String, default : -1},
		},
		southwest :{
			longitude : {type : String, default : -1},
			latitude : {type : String, default : -1},
		}
	},
	listOfRequests : [Schema.Types.ObjectId], //list of all requests made in this city
	//maybe define seperate object as zone in database....thinkofit
	zones	: [ //list of zones in this city
		{ 
			name : String, //zone Name
			location : { //zone location borders
				northeast : { 
					longitude : {type : String, default : -1},
					latitude : {type : String, default : -1},
				},
				southwest :{
					longitude : {type : String, default : -1},
					latitude : {type : String, default : -1},
			},
			requests:[Schema.Types.ObjectId] //requests in this zones
		} 	
	}]

});


module.exports = mongoose.model('City', requestSchema);
