/////////////////////////////////////////////////////////////
//////////AUTHORS :   chocof (https://github.com/chocof)/////
//////////File :  app/api/phoneAPI.js             /////////
/////////////////////////////////////////////////////////////
const GOOGLE_URL = "https://maps.googleapis.com/maps/api/place/radarsearch/json?"
const KILOMETER  = 1000

//for making http requests to google API's
var rp = require('request-promise');
var cc = require('coupon-code');

//for parsing
var qs = require('qs');

var User = require('../models/userModel');        ///User's Model

module.exports = function(app,tools, privateData) {

	app.route("/api/v1/phone/signup")
		
	/**
 		*@api {post} /api/v1/phone/signup Signup user in the application
 		*@apiName phoneSignup
 		*@apiGroup Phone
 		*
		*
		*@apiParam {json} Users' mail, username and password are mandatory. Name, surname, age are optional
 		*@apiParamExample {json} Request-Example:
        *    {
        *		email		: USER_EMAIL,
		*		password	: USER_PASSWORD,
		*		username	: USER_USERNAME,
		*		name		: USER_NAME,
		*		surname		: USER_SURNAME,
		*		age			: USER_AGE
        *	} 
		*
		*
		*@apiSuccess {String} successMessage Success message
		*@apiSuccessExample {json} Success-Response:
        *	  {authentication : USER_SESSION_CODE}
        *
		*@apiError 400 BAD REQUEST
		*@apiError 401 Authorization Failed
		*@apiError 500 Internal Server Error
        *@apiErrorExample {json} Error-Response:
 		*     {errorMessage: ERROR_MESSAGE }
 		*/.post(function(req,res){
			var userData = req.body
			if (!userData){
				res.status(400).send({errorMessage: "You sent an empty request"})
		    	return

			}

			//check if request is ok
            if (!userData.username || !userData.email || !userData.password){
            	res.status(400).send({errorMessage: "Username, password and email fields are required"})
		    	return 
		    }
		    if (!tools.validEmail(userData.email)){
                res.status(400).send({errorMessage: "Not valid email"})
		    	return
            }
            //find if anybody else is using this email or username
            User
                .findOne({ $or: [ { 'username': userData.username }, { 'email': userData.email } ] },function(err,user){
                    // if there are any errors, return the error
                    if (err){
                        res.status(500).send({errorMessage: "We're sorry something went wrong"})
						return
					}

                    if (user) {
						res.status(400).send({errorMessage: "User already exists"})
					   	return                    
		    		} else {

                        //else create user
                        var newUser     = new User();

                        //Init user's info
                        newUser.email           = userData.email;
                        newUser.password        = newUser.generateHash(userData.password);
                        newUser.username        = userData.username;
                        newUser.name            = userData.name;
                        newUser.surname         = userData.surname;
                        newUser.age             = userData.age;
                        newUser.onPhoneSession  = true;
                        //create unique code
	            		newUser.sessionCode = cc.generate();
	            

                        // save user
                        newUser.save(function(err) {
                            if (err){ 
                                res.status(500).send({message : err.message})
                                return;
                            }
                            res.send({authentication : newUser.sessionCode})
                        });
                  
                    }

            });    



		})


	//We cannot use cookies with phone so we'll set up a custom session
	app.route("/api/v1/phone/login")


		/**
 		*@api {post} /api/v1/phone/login Logs user in the application
 		*@apiName phoneLogin
 		*@apiGroup Phone
 		*
		*
		*@apiParam {json} User's username or email in the field username and password on password
 		*@apiParamExample {json} Request-Example:
        *    {
        *		username : email_or_username,
        *		password : user_password
		*	}
		*
		*@apiSuccess {String} successMessage Success message
		*@apiSuccessExample {json} Success-Response:
        *	  {authentication : USER_SESSION_CODE}
        *
		*@apiError 400 BAD REQUEST
		*@apiError 401 Authorization Failed
		*@apiError 404 Couldn't find user
        *@apiError 500 Internal Server Error
        *@apiErrorExample {json} Error-Response:
 		*     {errorMessage: ERROR_MESSAGE }
 		*/
 		.post(function(req,res){

 			var username = req.body.username
 			var password = req.body.password
 			console.log("User "+username+" tries to log in")

 			//user can login with either his namespace or email so check for both
        	User.findOne({$or : [{ 'email'  :  username },{'username' : username}]}, function(err, user) {
	            if (err){
	            	console.log ("[-]Error at phoneAPI login function" + e)
	            	res.status(500).send({errorMessage: "Sorry we seem to have some problems please try again later"})
		    		return
		    	}
	                
	            //If wrong username
	            if (!user){
	                res.status(404).send({errorMessage : "We are sorry but we couldn't find you :("})
	                return	
	            }
	            //Check if password is valid
	            if (!user.validPassword(password)){
	                //keep ip somewhere
	                //in the future allow only three tries for this ip
	                var possibleThreatIp = req.headers['x-forwarded-for'] || 
	                    req.connection.remoteAddress || 
	                    req.socket.remoteAddress ||
	                    req.connection.socket.remoteAddress;
	                console.log("User with IP "+possibleThreatIp+" tried to access account of user " + user.username)
	            	res.status(401).send({errorMessage : "Passwords don't match please try again"})
	            	return;
	            }	

	            //if ok state that user started a new session
	            user.onPhoneSession = true

	            //create unique code
	            user.sessionCode = cc.generate();
	            
	            //save changes and continue
	            user.save(function(err,user){
	            	if (err){
	    	        	console.log ("[-]Error at phoneAPI login function" + e)
		    			res.status(500).send({errorMessage: "Sorry we seem to have some problems please try again later"})
		    		}

					console.log("User "+user.username+" successfully logged in to phone app")
	            	
	            	res.send({authentication : user.sessionCode})
	            })
			});
		})


	app.route("/api/v1/phone/search")
		
		/**
 		*@api {post} /api/v1/phone/search Gets nearby locations depending on users' search
 		*@apiName phoneSearch
 		*@apiGroup Phone
 		*
 		*@apiHeaderExample {json} Header-Example: 
		*	{
		*		"authorization": "username=<user_username>&sessionCode=<code_we_gave_you_in_login>"
		*	}
		*
		*
		*@apiParam {json} User's username or email in the field username and password on password
 		*@apiParamExample {json} Request-Example:
        *    {
        *		location : {
		*			longtitude :	location_longtitude,
		*			latitude   :	location_latitude
		*		},
        *		search_type : what_user_is_looking_for
		*	}
		*
		*@apiSuccess {String} successMessage Success message
		*@apiSuccessExample {json} Success-Response:
        *	  {
        *		resultsArray : [
		*
		*
        *				]
        *		}
        *
		*@apiError 400 BAD REQUEST
		*@apiError 401 Authorization Failed
		*@apiError 404 Couldn't find user
        *@apiError 500 Internal Server Error
        *@apiErrorExample {json} Error-Response:
 		*     {errorMessage: ERROR_MESSAGE }
 		*/
		.post(tools.authenticateUserPhone, function(req, res, next){

			var url = GOOGLE_URL + "location=" 
			
			//specify location
			url = url + req.body.location.longtitude + "," + req.body.location.latitude + "&" 

			//specify radius
			url = url + "radius=" + KILOMETER + "&"

			//specify search type
			url = url + "type="   +  + "&"

			var url = url + privateData.googleApiKey

			rp(url)
			.then(function(result){




			})
			.catch(function (err){
				res.status(500).send({message : err.message})
			});
		})

	app.route ( "/api/v1/phone/user" )

		/**
 		*@api {get} /api/v1/phone/user Gets phone user information
 		*@apiName PhoneUserInfo
 		*@apiGroup Phone
 		*
 		*@apiHeaderExample {json} Header-Example: 
		*	{
		*		"authorization": "username=<user_username>&sessionCode=<code_we_gave_you_in_login>"
		*	}
		*
		*@apiSuccess {json} info Json object which contains user data
		*@apiSuccessExample {json} Success-Response:
        *	  {	
        *		info	:	{
		*			email 		: USERS_EMAIL,
		*			username	: USER_USERNAME
		*			name		: USERS_NAME,
		*			surname		: USERS_SURNAME,
		*			age			: USERS_AGE
		*		}
        *	}
        *
		*@apiError 404 User Not Found
		*@apiError 401 Authorization Failed
        *@apiError 500 Internal Server Error
        *@apiErrorExample {json} Error-Response:
 		*     {message: ERROR_MESSAGE }
 		*/
		.get(tools.authenticateUserPhone, function(req,res,next){
			var sessionData = qs.parse(req.headers.authorization)

			//find user by username
			User.findOne({"username" : sessionData.username}, function( err, user ) {
				if ( err ) {
					console.log( "Getting User Info Error : ", err.message )
					res.status( 500 ).send ( {errorMessage : err.message} )
					return;
				}


				var jsonToSend = {
					info : {

						email 	 : user.email,
						username : user.username,
						name     : user.name,
						surname  : user.surname,
						age 	 : user.age 
					}
				};

				res.send( jsonToSend );
			})
		})


		/**
 		*@api {post} /api/v1/phone/user Sets phone user information
 		*@apiName PhoneUserSetInfo
 		*@apiGroup Phone
 		*
 		*@apiHeaderExample {json} Header-Example: 
		*	{
		*		"authorization": "username=<user_username>&sessionCode=<code_we_gave_you_in_login>"
		*	}
		*
		*@apiParam {json} Attributes to change for user
 		*@apiParamExample {json} Request-Example:
        *    {
        *		username 	: username_to_change_it_with,
        *		email		: email_to_change_it_with,
        *		name		: name_to_change_it_with,
        *		surname		: surname_to_change_it_with,
        *		age			: age_to_change_it_with  		
		*	}
		*
		*@apiSuccess {String} successMessage Success message
		*@apiSuccessExample {json} Success-Response:
        *	  {successMessage : SUCCESS_MESSAGE}
        *
		*@apiError 400 BAD REQUEST
		*@apiError 401 Authorization Failed
        *@apiError 500 Internal Server Error
        *@apiErrorExample {json} Error-Response:
 		*     {errorMessage: ERROR_MESSAGE }
 		*/
		.post(tools.authenticateUserPhone, function(req,res,next){
			var sessionData = qs.parse(req.headers.authorization)

			//find user by username
			User.findOne( {"username" : sessionData.username}, function( err, user ) {
				if ( err ) {
					console.log( "Getting User Info Error : ", err.message )
					res.status(500).send( {errorMessage : err.message} )
					return;
				}

				//set new attributes
				var toChangeAttrs = req.body;
				var arrayOfAllowedAttrs = [ 'username', 'email', 'name', 'surname', 'age' ];

				for ( attr in toChangeAttrs ) {
					//if user wants to change password
					if (attr === 'password' && toChangeAttrs[attr] && toChangeAttrs[attr] != ""){
						user.password = user.generateHash(toChangeAttrs[attr]);
						continue;
					}

					//else set normally
					if (arrayOfAllowedAttrs.indexOf(attr) >= 0 && toChangeAttrs[attr] && toChangeAttrs[attr] != ""){
						if (attr == 'email' && !tools.validEmail(toChangeAttrs[attr])){
							res.status(400).send({errorMessage : "This is not a valid email"})
							return
						}

						user[attr] = toChangeAttrs[attr];
					}
					//check for malicius use
					else if (attr === 'id' || attr === '_id') {
						console.log("User with email " + user.email + " and username " 
							+ user.username + " is trying to change his id.");
						res.status(400).send({errorMessage : "You can't change your id"})
						return
					}
				}

				//save user
				user.save( function( err, user ) {
					if ( err ) {
						console.log( "Getting User Info Error : ", err.message)
						res.status(500).send( {errorMessage : err.message} )
						return;
					}

					res.send( {successMessage : "Changes submited"} )
				});
			});
		});

	/**
 		*@api {get} /api/v1/phone/logout Logs user out of the session
 		*@apiName PhoneLogout
 		*@apiGroup Phone
 		*
		*@apiHeaderExample {json} Header-Example: 
		*	{
		*		"authorization": "username=<user_username>&sessionCode=<code_we_gave_you_in_login>"
		*	}
		*@apiSuccess {json} message Message with info
		*@apiSuccessExample {json} Success-Response:
        *	  {	message : SUCCESS_STRING}
        *
		*@apiError 400 BAD REQUEST
		*@apiError 401 Authorization Failed
        *@apiError 500 Internal Server Error
        *@apiErrorExample {json} Error-Response:
 		*     {errorMessage: ERROR_MESSAGE }
 		*/	
	app.route("/api/v1/phone/user/logout")

		.get(tools.authenticateUserPhone, function(req,res){
			var sessionData = qs.parse(req.headers.authorization)

			//find user by username
			User.findOne( {"username" : sessionData.username}, function( err, user ) {
				if ( err ) {
						console.log( "Error during logout: ", err.message)
						res.status(500).send( {errorMessage : err.message} )
						return;
					}
				user.sessionCode = "";
				user.onPhoneSession  = false;	
					
				user.save(function(err){
					if ( err ) {
						console.log( "Error during logout: ", err.message)
						res.status(500).send( {errorMessage : err.message} )
						return;
					}
					console.log("User "+user.username+"logged out");
					res.send({successMessage : "You Logged Out Of Session"})	
				})	


			})

		})


}