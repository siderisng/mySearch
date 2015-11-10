/////////////////////////////////////////////////////////////
//////////AUTHORS :   chocof (https://github.com/chocof)/////
//////////File :   config/tools.js                  /////////
/////////////////////////////////////////////////////////////

var User = require('../app/models/userModel');        ///User's Model

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

	//Authentication header : username=<user_username>&sessionCode=<User_session_password>
	authenticateUserPhone : function(req,res,next){
		

		if (!req.headers.authorization || req.headers.authorization == ""){
				res.status(400).send({message : "You have to set authorization header"})
				return
		}
		var sessionData = qs.parse(req.headers.authorization)
		

		User.findOne({"username" : sessionData.username}, function(err,user){
			if (err){
				console.log("[-]An error happened in phone session authorization: " + err)
				res.status(500).send({message : "We are sorry an error occured try again later"})
				return
			}

			if (!user){
				res.status(404).send({message : "User "+ sessionData.username +" not found!!!"})
				return
			}

			if (!user.onPhoneSession){
				console.log("[-]User " + user.username +" tried to access private content while out of session")
				res.status(401).send({ message : "Please login first"})
				return
			}
			
			if (user.sessionCode != sessionData.sessionCode){
				 var possibleThreatIp = req.headers['x-forwarded-for'] || 
	                    req.connection.remoteAddress || 
	                    req.socket.remoteAddress ||
	                    req.connection.socket.remoteAddress;
	                console.log("User with IP "+possibleThreatIp+" tried to access account of user " + user.username)
	            	res.status(401).send({message : "Passwords don't match please try again"})
					return
			}

			return next();

		})
		
	},

	validEmail : function (email){
        var re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        return re.test(email)
    },

    //recursively save a list 
		//of entities
		//Used in order to save more than one entities
	
	availableSearches : [  "accounting","airport","amusement_park","aquarium","art_gallery","atm","bakery","bank","bar"
		,"beauty_salon","bicycle_store","book_store","bowling_alley","bus_station","cafe","campground","car_dealer"
		,"car_rental","car_repair","car_wash","casino","cemetery","church","city_hall","clothing_store","convenience_store"
		,"courthouse","dentist","department_store","doctor","electrician","electronics_store","embassy","establishment","finance","fire_station","florist","food","funeral_home","furniture_store","gas_station"
		,"general_contractor","grocery_or_supermarket","gym","hair_care","hardware_store","health","hindu_temple","home_goods_store","hospital"
		,"insurance_agency","jewelry_store","laundry","lawyer","library","liquor_store","local_government_office","locksmith","lodging","meal_delivery","meal_takeaway","mosque"
		,"movie_rental","movie_theater","moving_company","museum","night_club","painter","park","parking","pet_store","pharmacy","physiotherapist","place_of_worship","plumber","police","post_office"
		,"real_estate_agency","restaurant","roofing_contractor","rv_park","school","shoe_store","shopping_mall","spa"
		,"stadium","storage","store","subway_station","synagogue","taxi_stand","train_station","travel_agency","university","veterinary_care","zoo"
	]


}

