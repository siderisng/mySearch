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
	saveToDB : function (stack){
		var entity = stack.pop();
		if (entity)
			entity.save(function(err){
				saveToDB(stack)
			})
	},
	availableSearches : [  	"Airport", "Amusement park","Aquarium", "Art gallery", "Atm", "Bakery","Bank", "Bar"
    						,"Beauty salon", "Bicycle store","Book store", "Bowling alley", "Bus station", "Cafe"
    						, "Campground", "Car dealer", "Car rental", "Car repair", "Car wash", "Casino", "Church"
    						,"City hall", "Clothing store", "Convenience store", "Courthouse", "Dentist", "Department store"
    						, "Doctor", "Electrician", "Electronics store", "Embassy", "Finance", "Fire station", "Florist", "Food"
							, "Funeral home", "Furniture store", "Gas station", "General contractor", "Grocery or Supermarket"
							, "Gym", "Hair care", "Hardware store", "Health", "Home goods store", "Hospital", "Insurance agency"
							, "Jewelry strore", "Laundry", "Lawyer", "Library", "Liquor store", "Local government office", "Lodging"
							, "Meal delivery", "Meal takeaway", "Mosque", "Movie rental", "Movie theater", "Moving company", "Museum"
							, "Night club", "Painter", "Park", "Parking", "Pet shop", "Pharmacy", "Physiotherapist", "Place of worship"
							, "Plumber", "Police", "Post Office", "Real estate agency", "Restaurant", "Roofing contractor", "Rv park"
							, "School", "Shoe store", "Shopping mall", "Spa", "Stadium", "Storage", "Store", "Subway station"
							, "Synagogue", "Taxi stand", "Train station", "Travel agency", "University", "Veterinary care", "Zoo"
						]


}

