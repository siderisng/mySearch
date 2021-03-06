/////////////////////////////////////////////////////////////
//////////AUTHORS :   chocof (https://github.com/chocof)/////
//////////File :  app/api/phoneAPI.js               /////////
/////////////////////////////////////////////////////////////

/**
	Basic REST API for phone Users
	It provides core functions like login ,signup
	info edit etc. /api/v1/phone/search is also implemented 
	here.

*/

//Url for google Places api
const GOOGLE_PLACES_URL = "https://maps.googleapis.com/maps/api/place/radarsearch/json?"
//Url for google geolocation api
const GOOGLE_GEO_URL    = "https://maps.googleapis.com/maps/api/geocode/json?"
//Url for getting place from id
const GOOGLE_PLACES_ID_URL = "https://maps.googleapis.com/maps/api/place/details/json?placeid="
//Our DB server url
const DB_SERVER_URL		= "http://localhost:8500"
//Default search radius
const KILOMETER  = 1000


//for making http requests to google API's
var rp = require('request-promise');
var cc = require('coupon-code');

//for header parsing
var qs = require('qs');

var User 	= require('../models/userModel');        ///User's Model

module.exports = function(app,tools, privateData) {

	app.route("/api/v1/phone/signup")
		
	/**
 		*@api {post} /api/v1/phone/signup Signup user in the application
 		*@apiName phoneSignup
 		*@apiGroup Phone
 		*
		*
		*@apiParam {json} userData Users' mail, username and password are mandatory. Name, surname, age are optional
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
            if (userData.username.length < 3){
            	res.status(400).send({errorMessage: "Username must be at least 3 characters"})
		    	return 

            }

            if (userData.password.length < 6){
            	res.status(400).send({errorMessage: "Password must be at least 6 characters"})
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
                                res.status(500).send({errorMessage : err.message})
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
		*@apiParam {json} userData User's username or email in the field username and password on password
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
		});
	



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
        *	  	{	
        *		info	:	{
		*			email 		: USERS_EMAIL,
		*			username	: USER_USERNAME
		*			name		: USERS_NAME,
		*			surname		: USERS_SURNAME,
		*			age			: USERS_AGE
		*			}
        *		}
        *
		*@apiError 404 User Not Found
		*@apiError 401 Authorization Failed
        *@apiError 500 Internal Server Error
        *@apiErrorExample {json} Error-Response:
 		*     {errorMessage: ERROR_MESSAGE }
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
		*@apiParam {json} toChangeAttrs Attributes to change for user
 		*@apiParamExample {json} Request-Example:
        *    {
        *		username 	: username_to_change_it_with,
        *		email		: email_to_change_it_with,
        *		password    : password_to_change_it_with,
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

				var makeCheck = false;
				//set new attributes
				var toChangeAttrs = req.body;
				var arrayOfAllowedAttrs = [ 'username', 'email', 'name', 'surname', 'age' ];

				for ( attr in toChangeAttrs ) {
					//if user wants to change password
					if (attr === 'password' && toChangeAttrs[attr] && toChangeAttrs[attr] != ""){
						if (toChangeAttrs[attr].length < 6){
							res.status(400).send({errorMessage : "Password must be more than 6 characters"})
							return
						}
						user.password = user.generateHash(toChangeAttrs[attr]);
						continue;
					}
					
					//check if we need to make changes	
					if (attr === 'email' || attr === 'username'){
						makeCheck = true;
						if (attr === 'username' && toChangeAttrs[attr] && toChangeAttrs[attr].length < 3){
							res.status(400).send({errorMessage : "Username must be more than 6 characters"})
							return
						}
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

				if (!makeCheck){
					//save user
					user.save(function(req, user){
						if (err){
							console.log("Getting User Info  Error : ",e.message)
			      	    	res.status(500).send({errorMessage : err.message})
							return;
						}

						res.send({successMessage : "Changes submited"});
					});
				}
				else
					User.findOne({ $or: [ { 'username': toChangeAttrs.username }, { 'email': toChangeAttrs.email } ] },function(err,otherUser){
                    // if there are any errors, return the error
                    if (err){
                        res.status(500).send({errorMessage : err.message})
						return;
					}
                    if (otherUser) {
                    	res.status(400).send({errorMessage : "We are sorry username or email you entered are taken"});
                    	return;
					}
					user.save(function(req, user){
						if (err){
							console.log("Getting User Info  Error : ",e.message)
			      	    	res.status(500).send({errorMessage : err.message})
							return;
						}

						res.send({successMessage : "Changes submited"});
					});
			});
		});
	});


	//////////////*
	// IMPORTANT NOTE:
	// Google places Api autocorrect offers input choice. Use
	// it in order to let users search for results by providing a
	// string.. Maybe in the future as an extra
	/////////////*
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
		*@apiParam {json} queryInfo Current User Location, query,radius
 		*@apiParamExample {json} Request-Example:
        *    {
        *		location : {
		*			longitude :	location_longtitude,
		*			latitude   :	location_latitude
		*		},
        *		search_type : what_user_is_looking_for,
        *		radius		: radius for search (default 1 KLM)
		*	}
		*
		*@apiSuccess {String} successMessage Success message
		*@apiSuccessExample {json} Success-Response:
        *	  		[
		*					{
		*						location : {lat : latitude, lng : longitude},
		*						place_id : UNIQUE_PLACE_ID
		*					},
		*						...
		*					{
		*						location : {lat : latitude, lng : longitude},
		*						place_id : UNIQUE_PLACE_ID
		*					}
		*	 		]
        *		
        *
        *
		*@apiError 400 BAD REQUEST
		*@apiError 401 Authorization Failed
		*@apiError 404 Couldn't find user
        *@apiError 500 Internal Server Error
        *@apiErrorExample {json} Error-Response:
 		*     {errorMessage: ERROR_MESSAGE }
 		*/
		.post(tools.authenticateUserPhone, function(req, res, next){
			
			var sessionData = qs.parse(req.headers.authorization)
		
			if (!req.body.search_type || !req.body.location){
				res.status(400).send( {errorMessage : "Some Fields Are Missing"} )
				return;
			} 

			//Find this user
			User.findOne({"username" : sessionData.username}, function(err,user){
				var url = GOOGLE_PLACES_URL + "location=" 
				
				var location = req.body.location
				//check if location is not JSON parsed
				if (!location.longitude)
					try {
						location = JSON.parse(location);
					}catch(e){
						res.status(400).send({errorMessage : "Invalid Data please try again"})
						return;
					} 
				//specify location
				url = url + location.latitude + "," + location.longitude + "&" 
				//specify radius
				url = url + "radius=" + ((req.body.radius)?req.body.radius:KILOMETER) + "&"
				//specify search type
				if (!req.body.search_type || tools.availableSearches.indexOf(req.body.search_type) < 0){
					res.status(400).send( {errorMessage : "Not a valid search type"} )
					return;
				}
				
				//set search type
				url = url + "type="   + req.body.search_type 
				//set api key
				url = url + "&key=" + privateData.googleApiKey
				

				//send request to google Places Api
				rp(url)
				.then(function(resultRaw){
					//parse request
					var resp = JSON.parse(resultRaw);
					editResult(req,res,user,location,resp.results)
				})
				.catch(function (err){
					console.log("Error during places post " + err.message);
					res.status(500).send({errorMessage : err.message})
					return;
				});
			})
		})

		/**
			@name editResult
			@info This function gets the result from google Places API 
			edits it and then sends http response to user. Then it 
			creates a new request entity, updates city info and 
			saves user
			@params reg 		: http request
					res 		: http response
					user		: User entity
					location	: Location where request was made
					googleRes	: Google Response to user query

		*/
		function editResult(req,res,user,location,googleRes){
			var returnArray = [];
			for (var i = 0; i < googleRes.length; i++) {
			    returnArray.push({location : googleRes[i].geometry.location , place_id : googleRes[i].place_id});
			}	

			//respond to user with the request
			res.send(returnArray);

			//Now get user Location using geolocation
			var url = GOOGLE_GEO_URL + 'latlng=' + location.latitude + ',' + location.longitude + '&key=' + privateData.googleApiKey;
			console.log(url)
			rp(url)
				.then(function(resultRaw){
					createRequest(user,location,resultRaw,returnArray,req.body.search_type)
				})
				.catch(function (err){
					console.log("Error during geolocation post " + err.message);
					return	
				});


		};

		/**
			@name createRequest
			@info This function creates a new request and
			saves it into db. 
			@params user			: User entity
					location		: Location where request was made
					locationG   	: city were request was made location
					arrayWithResp	: Google Response to user query
					search_type 	: User's query

		*/
		function createRequest(user,location,locationG,arrayWithResp, search_type){
			//parse request to find city info
			var resp = JSON.parse(locationG);

			var check = 0;
			var city,country;
			var local;

			for (var i = 0; i < resp.results.length; i ++){
				if (resp.results[i].types[0] == "locality"){
					local = i;
				}
			}
			if (!local) return;
			
			for (var i = 0; i < resp.results[0].address_components.length; i++){
				if (resp.results[0].address_components[i].types[0] == "locality")
				{
					city = resp.results[0].address_components[i].long_name; 
					check++;
				}
				if (resp.results[0].address_components[i].types[0] == "country")
				{
					country = resp.results[0].address_components[i].long_name;
					check++;
				}
				if (check == 2) break;
			}
			
			if (i == resp.results[0].address_components.length) return;

			//create new Request	
			var newReq = { 	country 		: country,
							city   			: city,
							location		: location,
							query			: tools.prettySearches[search_type],
							googleResults 	: arrayWithResp,
							date 			: new Date()	
						};
			
			//Post data to db_server in order to save request			
			var options = {
			    method: 'POST',
			    uri: DB_SERVER_URL + "/api/v1/request",
			    body: newReq,
			    json: true 
			};	

			//Save New Request			
			rp(options)
				.then(function(reqId){
					//now add new request to user list of requests
					user.requestHistory.push(reqId.id);
					//continue with the city
					editCity(city,resp.results[local],reqId.id,user)
				})
				.catch(function (err){
					console.log("Error during new Request Creation " + err.message);
					return;	
				});
			
		}

		/**
			@name editCity
			@info This function searches the database for the city where
			the request was made. If such city doesn't exists it creates 
			a new one. If it does it updates it. After this it saves it on
			db 
			@params cityLoc			: Name of the city
					locationG   	: city were request was made location
					reqId			: Id of request made in city
					user			: User entity

		*/
		function editCity(cityLoc,locationG,reqId,user){
			//create new city object
			var city = {
				name : cityLoc,
				location : {
				   	northeast: {
				   		longitude	: locationG.geometry.bounds.northeast.lng,
						latitude 	: locationG.geometry.bounds.northeast.lat
					},
					southwest : {
							longitude 	: locationG.geometry.bounds.southwest.lng,
							latitude 	: locationG.geometry.bounds.southwest.lat
					}
				},
				request  : reqId
			};

			//Create request to save new city (or update old one) 
			var options = {
			    method: 'POST',
			    uri: DB_SERVER_URL + "/api/v1/city",
			    body: city,
			    json: true 
			};	
			rp(options)
				.then(function(data){
					console.log(data.message);
					if (user)
						saveUser(user);
				})
				.catch(function(err){
					console.log("Error During city edit" + err.message);
					
					return;
				})


		}


		/**
			@name saveUser
			@info This function saves the user in local db
			@params user			: User entity to be saved
		*/
		function saveUser(user){
			user.save(function(err){
				if (err){
						console.log("Couldn't save user :" + err.message);
						return;
					}
				console.log("Succesfully handled search request made by user "+user.username);
			})
		}

	app.route("/api/v1/phone/place/:place_id")
		

		/**
 		*@api {get} /api/v1/phone/place/:place_id Returns Info about place with id  place_id
 		*@apiName phonePlaceSearch
 		*@apiGroup Phone
 		*
 		*@apiHeaderExample {json} Header-Example: 
		*	{
		*		"authorization": "username=<user_username>&sessionCode=<code_we_gave_you_in_login>"
		*	}
		*
		*@apiSuccess {String} successMessage Success message
		*@apiSuccessExample {json} Success-Response:
        *	  		
		*					{
		*						address 	: place_address,
		*						name 		: place_name,
		*						openHours   : place_open_hours,
		*						phone		: place_phone,
		*						icon		: place_icon_to_display,
		*						website		: place_website,
		*						
		*					}
        *		
        *
        *
		*@apiError 400 BAD REQUEST
		*@apiError 401 Authorization Failed
		*@apiError 404 Couldn't find user
        *@apiError 500 Internal Server Error
        *@apiErrorExample {json} Error-Response:
 		*     {errorMessage: ERROR_MESSAGE }
 		*/
		.get(tools.authenticateUserPhone, function(req,res){

				
				rp(GOOGLE_PLACES_ID_URL + req.params.place_id +"&key=" + privateData.googleApiPlacesKey)
				.then(function(resp){
					var json = JSON.parse(resp);
					var toSend = {};	

					var result = json.result;
					if (!result){
						res.status(404).send({errorMessage :"Couldn't find info about place"})
						return;
					}	

					if (result.formatted_address)
						toSend.address = result.formatted_address;
					if (result.formatted_phone_number)
						toSend.phone = result.formatted_phone_number;
					if (result.icon)
						toSend.icon = result.icon;
					if (result.name)
						toSend.name = result.name;	
					if (result.opening_hours && result.opening_hours.weekday_text)
						toSend.openHours = result.opening_hours.weekday_text;
					if (result.website)
						toSend.website = result.website;
					res.send(toSend);
				})
				.catch(function (err){
					console.log("Error during places post " + err.message);
					res.status(500).send({errorMessage : err.message})
					return;
				});	

		});

	
	app.route("/api/v1/phone/user/logout")

	/**
 		*@api {get} /api/v1/phone/user/logout Logs user out of the session
 		*@apiName PhoneLogout
 		*@apiGroup Phone
 		*
		*@apiHeaderExample {json} Header-Example: 
		*	{
		*		"authorization": "username=<user_username>&sessionCode=<code_we_gave_you_in_login>"
		*	}
		*@apiSuccess {json} message Message with info
		*@apiSuccessExample {json} Success-Response:
        *	  {	successMessage : SUCCESS_STRING}
        *
		*@apiError 400 BAD REQUEST
		*@apiError 401 Authorization Failed
        *@apiError 500 Internal Server Error
        *@apiErrorExample {json} Error-Response:
 		*     {errorMessage: ERROR_MESSAGE }
 		*/	
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
					console.log("User "+user.username+" logged out");
					res.send({successMessage : "You Logged Out Of Session"})	
				})	


			})

		})

};
