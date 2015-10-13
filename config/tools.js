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

		if (!req.isAuthenticated){

			 var possibleThreatIp = req.headers['x-forwarded-for'] || 
				req.connection.remoteAddress || 
				req.socket.remoteAddress ||
				req.connection.socket.remoteAddress;
			console.log("User with IP "+possibleThreatIp+" tried to access account of user " + user.username)
			res.status(401).send({message : "You are not authorized to access this content"});
			return;
		}
		return next();
	},

	//Authentication header : username=<user_username>&sessionCode=<User_session_password>
	authenticateUserPhone : function(req,res,next){
		
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
		
	}


}

