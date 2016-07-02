/////////////////////////////////////////////////////////////
//////////AUTHORS :   chocof (https://github.com/chocof)/////
//////////File :   config/tools.js                  /////////
/////////////////////////////////////////////////////////////

/**
	This module contains tools to be used frequently in our
	api. 
*/



var User = require('../app/models/userModel');        ///User's Model

//for parsing
var qs = require('qs');


module.exports = {

	//Middleware function to check if user is authenticated
	authenticateUser : function(req,res,next){
		
		//If user is authenticated let him access next content
		if (req.isAuthenticated()){
			return next();
		}//Else notify server about the request
		else{
			var possibleThreatIp = req.headers['x-forwarded-for'] || 
			req.connection.remoteAddress || 
			req.socket.remoteAddress ||
			req.connection.socket.remoteAddress;
			console.log("User with IP "+possibleThreatIp+" tried to access private content")
			res.status(401).send({message : "You are not authorized to access this content"});
			return		
		}
	},	

	//Middleware function to check if phone user is authenticated
	authenticateUserPhone : function(req,res,next){
		

		//check if authorization header is set
		if (!req.headers.authorization || req.headers.authorization == ""){
				res.status(400).send({message : "You have to set authorization header"})
				return
		}

		//Parse header to get session data
		var sessionData = qs.parse(req.headers.authorization)
		

		//Find a user linked to this data
		User.findOne({ $or: [ { 'username': sessionData.username }, { 'email': sessionData.username } ] }, function(err,user){
			if (err){
				console.log("[-]An error happened in phone session authorization: " + err)
				res.status(500).send({message : "We are sorry an error occured try again later"})
				return
			}


			//If user doesn't exists authorization header is invalid
			if (!user){
				res.status(404).send({message : "User "+ sessionData.username +" not found!!!"})
				return
			}

			//If user isn't logged in ask him to
			if (!user.onPhoneSession){
				console.log("[-]User " + user.username +" tried to access private content while out of session")
				res.status(401).send({ message : "Please login first"})
				return
			}
			
			//If user is logged in but the session code is wrong it maybe is an attack 
			if (user.sessionCode != sessionData.sessionCode){
				 var possibleThreatIp = req.headers['x-forwarded-for'] || 
	                    req.connection.remoteAddress || 
	                    req.socket.remoteAddress ||
	                    req.connection.socket.remoteAddress;
	                console.log("User with IP "+possibleThreatIp+" tried to access account of user " + user.username)
	            	res.status(401).send({message : "Passwords don't match please try again"})
					return
			}

			//if everything is ok return
			return next();

		})
		
	},

	/**
		@name validEmail
	 	@info Check with a regexp if an email is a valid email or not
		@params email : email to be checked
		@output	(boolean) true if email is valid, false otherwise
	*/
	validEmail : function (email){
        var re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        return re.test(email)
    },

    /**
		All our available Searches
	
    */ 
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


	prettySearches : {
		"accounting" 		: "Accounting",
		"airport"	  		: "Airport",
		"amusement_park"	: "Amusement Park",
		"aquarium"			: "Aquarium",
		"art_gallery"		: "Art Gallery",
		"atm"				: "ATM",
		"bakery"			: "Bakery",
		"bank"				: "Bank",
		"bar"				: "Bar",
		"beauty_salon" 		: "Beauty Salon",
		"bicycle_store"		: "Bicycle Store",
		"book_store"		: "Book Store",
		"bowling_alley"		: "Bowling Alley",
		"bus_station"		: "Bus Station",
		"cafe"				: "Cafe",
		"campground"		: "Campground",
		"car_dealer"		: "Car Dealer",
		"car_rental"		: "Car Rental",
		"car_repair"		: "Car Repair",
		"car_wash"			: "Car Wash",
		"casino"			: "Casino",
		"cemetery"			: "Cemetery",
		"church"			: "Church",
		"city_hall"			: "City Hall",
		"clothing_store"	: "Clothing Store",
		"convenience_store" : "Convenience Store",
		"courthouse"		: "Couthouse",
		"dentist"			: "Dentist",
		"department_store"	: "Department Store",
		"doctor"			: "Doctor",
		"electrician"		: "Electrician",
		"electronics_store" : "Electronics Store",
		"embassy"			: "Embassy",
		"establishment"		: "Establishment",
		"finance"			: "Finance",
		"fire_station"		: "Fire Station",
		"florist"			: "Florist",
		"food"				: "Food",
		"funeral_home"		: "Funeral Home",
		"furniture_store"	: "Furniture Store",
		"gas_station"		: "Gas Station",
		"general_contractor"		: "General Contractor",
		"grocery_or_supermarket" 	: "Grocery or Supermarket",
		"gym"				: "Gym",
		"hair_care"			: "Hair Care",
		"hardware_store"	: "Hardware Store",
		"health"			: "Health",	
		"hindu_temple"		: "Hindu Temple",
		"home_goods_store"	: "Home Goods Store",
		"hospital"			: "Hospital",
		"insurance_agency"  : "Insurance Agency",
		"jewelry_store"		: "Jewelry Store",
		"laundry"			: "Laundry",
		"lawyer"			: "Lawyer",
		"library"			: "Library",
		"liquor_store"		: "Liquor Store",
		"local_government_office"	: "Local Government Office",
		"locksmith"			: "Locksmith",
		"lodging"			: "Lodging",
		"meal_delivery"		: "Meal Delivery",
		"meal_takeaway"		: "Meal Takeaway",
		"mosque"			: "Mosque",
		"movie_rental"		: "Movie Rental",
		"movie_theater"		: "Movie Theater",
		"moving_company" 	: "Moving Company",
		"museum" 			: "Museum",
		"night_club" 		: "Night Club",
		"painter"			: "Painter",
		"park" 				: "Park",
		"parking" 			: "Parking",
		"pet_store" 		: "Pet Store",
		"pharmacy" 			: "Pharmacy",
		"physiotherapist"   : "Physiotherapist",
		"place_of_worship"	: "Place Of Worship",
		"plumber"			: "Plumber",
		"police"			: "Police",
		"post_office"		: "Post Office",
		"real_estate_agency": "Real Estate Agency",
		"restaurant"		: "Restaurant",
		"roofing_contractor": "Roofing Contractor",
		"rv_park"			: "RV Park",
		"school"			: "School",
		"shoe_store"		: "Shoe Store",
		"shopping_mall"		: "Shopping Mall",
		"spa"				: "Mall",
		"stadium"			: "Stadium",
		"storage"			: "Storage",
		"store"				: "Store",
		"subway_station"	: "Subway Station",
		"synagogue"			: "Synagogue",
		"taxi_stand"		: "Taxi Stand",
		"train_station"		: "Train Station",	
		"travel_agency"		: "Travel Agency",
		"university"		: "University",
		"veterinary_care"	: "Veterinary care",
		"zoo" 				: "Zoos"
	}




}

