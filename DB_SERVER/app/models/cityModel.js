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
			longitude : {type : Number, default : -1},
			latitude : {type : Number, default : -1},
		},
		southwest :{
			longitude : {type : Number, default : -1},
			latitude : {type : Number, default : -1},
		}
	},
	listOfRequests : [Schema.Types.ObjectId], //list of all requests made in this city
	//maybe define seperate object as zone in database....thinkofit
	zones	: [ //list of zones in this city
		{ 
			name : String, //zone Name
			location : { //zone location borders
				northeast : { 
					longitude : {type : Number, default : -1},
					latitude : {type : Number, default : -1},
				},
				southwest :{
					longitude : {type : Number, default : -1},
					latitude : {type : Number, default : -1},
				},
			},
			requests:[Schema.Types.ObjectId] //requests in this zones
	}],
	outOfZone : [Schema.Types.ObjectId] //requests that are out of bounds

});


module.exports = mongoose.model('City', requestSchema);
