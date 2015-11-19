/////////////////////////////////////////////////////////////
//////////AUTHORS :   chocof (https://github.com/chocof)/////
//////////File :   config/tools.js                  /////////
/////////////////////////////////////////////////////////////

var User 	= require('../app/models/msaUser');        		///User's Model
var City 	= require('../app/models/cityModel'); ///City's Model
var Request = require('../app/models/requestModel'); ///City's Model


//for parsing
var qs = require('qs');

//this module will contain basic functions and methods to use in the application
// so it will basically work as a toolbox
module.exports = {

	//this function will be used to authenticate user when he tries to access 
	//private content
	authenticateUser : function(req,res,next){
		
		if (req.isAuthenticated()){
			return next();
		}else{
			var possibleThreatIp = req.headers['x-forwarded-for'] || 
			req.connection.remoteAddress || 
			req.socket.remoteAddress ||
			req.connection.socket.remoteAddress;
			console.log("User with IP "+possibleThreatIp+" tried to access private content")
			res.status(401).send({message : "You are not authorized to access this content"});
			return		
		}
	},


	validEmail : function (email){
        var re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        return re.test(email)
    },

	availableSearches : [  "accounting","airport","amusement_park","aquarium","art_gallery","atm","bakery","bank","bar"
		,"beauty_salon","bicycle_store","book_store","bowling_alley","bus_station","cafe","campground","car_dealer"
		,"car_rental","car_repair","car_wash","casino","cemetery","church","city_hall","clothing_store","convenience_store"
		,"courthouse","dentist","department_store","doctor","electrician","electronics_store","embassy","establishment","finance","fire_station","florist","food","funeral_home","furniture_store","gas_station"
		,"general_contractor","grocery_or_supermarket","gym","hair_care","hardware_store","health","hindu_temple","home_goods_store","hospital"
		,"insurance_agency","jewelry_store","laundry","lawyer","library","liquor_store","local_government_office","locksmith","lodging","meal_delivery","meal_takeaway","mosque"
		,"movie_rental","movie_theater","moving_company","museum","night_club","painter","park","parking","pet_store","pharmacy","physiotherapist","place_of_worship","plumber","police","post_office"
		,"real_estate_agency","restaurant","roofing_contractor","rv_park","school","shoe_store","shopping_mall","spa"
		,"stadium","storage","store","subway_station","synagogue","taxi_stand","train_station","travel_agency","university","veterinary_care","zoo"
	],

	//Split To Zones is the algorithm in which we divide each city
	//to different areas it will be executed every 24 hours
	splitToZones : function(){
		
		//first get all the cities	
		City.find({},function(err,cities){
			if (err){
				console.log("Couldn't retrieve all the cities in splitToZones function(error :" + err.message+")");
				return;
			}
			else if (!cities[0]){
				console.log("There ain't no city in the database uh-ha");
				return;
			}

			console.log(cities);	


		})

	}
};



/**
*	In this function we shall process city 
*   data and split every city in zones
*   @params stackToTemp
*
**/
function processCity(stackToTemp,stackToSave){




}

/**
*	In this function we shall save
*   changes made to each city
**/
function saveToDB(stack){
	entity = stack.pop();
	if (entity)
		entity.save(function(err){
			if (err)
				console.log("Error While Saving Data : " + err.message);
			saveToDB(stack);
		});
}

