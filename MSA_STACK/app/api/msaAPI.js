
/////////////////////////////////////////////////////////////
//////////AUTHORS :   chocof (https://github.com/chocof)/////
//////////File :  app/api/msaUserApi.js             /////////
/////////////////////////////////////////////////////////////


var User = require('../models/msaUser');        					///MSA User's Model


//DB server URL  
const DB_SERVER_URL		= "http://localhost:8500"

//for making http requests to google API's
var rp = require('request-promise');

module.exports = function(app,passport,tools, privateData) {
	

//------------------the functions bellow are alike the functions @mySearch

	//Used for signing up user in the application
	app.route('/api/v1/signup')
		/**
		*@api {post} /api/v1/signup Registers user to the website
		*@apiName UserSignUp
		*@apiGroup User
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
		*@apiSuccess {String} message Success message
		*@apiSuccessExample {json} Success-Response:
		*	  {successMessage : SUCCESS_MESSAGE}
		*
		*@apiError 400 BAD REQUEST
		*@apiError 500 Internal Server Error
		*@apiErrorExample {json} Error-Response:
		*     {message: ERROR_MESSAGE }
		*/
		.post(function(req, res, next) { //register user with passport
			passport.authenticate('signup', function(err, user, info) {
				
				//get errors
				if (err){
					console.log("Signup Error : ",err.message)
					res.status(500).send({errorMessage : err.message})
					return;
				};
				if(!user){
					errMess = req.flash('signupMessage')
					res.status(400).send({errorMessage : errMess[0]}); 
					return;
				}
				
				//log in user
				req.logIn(user, function(err) {
					if (err){
							console.log("Signup Error : ",e.message)
							res.status(500).send({errorMessage : err.message})
							return;
						}
						user.save(function(err,user){
							if (err){
								console.log("Signup Error : ",e.message)
								res.status(500).send({errorMessage : err.message})
								return;
							}
							res.status(200).send({successMessage : "You successfully signed up"})
						});	
					});	
			})(req, res, next);
		});


	//used for logging user in the application
	app.route('/api/v1/login')
		/**
		*@api {post} /api/v1/login Logs user in the website
		*@apiName UserLogin
		*@apiGroup User
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
		*	  {successMessage : SUCCESS_MESSAGE}
		*
		*@apiError 400 BAD REQUEST
		*@apiError 401 Authorization Failed
		*@apiError 500 Internal Server Error
		*@apiErrorExample {json} Error-Response:
		*     {errorMessage: ERROR_MESSAGE }
		*/
		.post(function(req, res, next) { //register user with passport
			passport.authenticate('login',function(err, user, info) {
				console.log(info)				
				//find errors(if they exist) and send message
				if (err){
					console.log("Login Error : ",e.message)
					res.status(500).send({errorMessage : "Couldn't Login"}); 
					return;
				};
				if(!user){
					res.status(400).send({errorMessage : "Couldn't Login"}); 
					return;
				}
				
				req.logIn(user, function(err) {
					
					console.log('[+]User with username '+user.username+' successfully logged in!!!')
					
						if (err){
							console.log("Login  Error : ",e.message)
							res.status(500).send({errorMessage : err.message})
							return;
						}
						res.status(200).send({successMessage : "You successfully logged in!!!"})
					
					});
			})(req, res, next);

		});	



	//-----------------From this point on every request needs to be authenticated-------------------//
	app.route('/api/v1/user')



		/**
		*@api {get} /api/v1/user Gets user information
		*@apiName UserInfo
		*@apiGroup User
		*
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
		*@apiError 400 BAD REQUEST
		*@apiError 401 Authorization Failed
		*@apiError 500 Internal Server Error
		*@apiErrorExample {json} Error-Response:
		*     {message: ERROR_MESSAGE }
		*/
		.get(tools.authenticateUser,function(req,res){

			//first find user by id
			User.findById(req.user,function(err, user){
				if (err){
					console.log("Getting User Info  Error : ",e.message)
					res.status(500).send({errorMessage : err.message})
					return;
				}
 				
 				rp(DB_SERVER_URL + "/api/v1/city/list")
 				.then(function(cities){				
 					var jsonToSend = {
						info : {

							email 	 : user.email,
							username : user.username,
							name     : user.name,
							surname  : user.surname,
							age 	 : user.age,
							expDate  : user.expDate
							},
						cities  : JSON.parse(cities) 
							
					};

					rp(DB_SERVER_URL + "/api/v1/request/sorted_list")
 					.then(function(list){		

 						if (list) 
 							jsonToSend.topRequests = JSON.parse(list)
 						else 
 							console.log("Top requests list is empty")
 						res.send(jsonToSend);
 					})	
 					.catch(function(err){
 						res.send({errorMessage : "Something went wrong!!! : O"});
 					})
				})

 				.catch(function(err){

 					if (err.statusCode === 404){
 						res.send({
 							info : {
								email 	 : user.email,
								username : user.username,
								name     : user.name,
								surname  : user.surname,
								age 	 : user.age
							}});
 					}else{
	 					console.log("Error While trying to gather userInfo :" + err.message);
						res.status(500).send("Sorry something went wrong");
						return;	
 					}
 				})
 			

 			})
		})




		/**
		*@api {post} /api/v1/user Sets user information
		*@apiName UserSetInfo
		*@apiGroup User
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
		*     {message: ERROR_MESSAGE }
		*/
		.post(tools.authenticateUser,function(req,res){

			//first find user by id
			User.findById(req.user,function(err, user){
				if (err){
					console.log("Getting User Info  Error : ",e.message)
					res.status(500).send({errorMessage : err.message})
					return;
				}

				var makeCheck = false;

				//set new attributes
				var toChangeAttrs = req.body; 
					
				var arrayOfAllowedAttrs = ['username','email','name','surname','age'];	
				for (attr in toChangeAttrs){
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
							res.status(400).send({errorMessage : "Username must be more than 3 characters"})
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

						res.send({successMessage : "Changes Saved to User"});
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

						res.send({successMessage : "Changes Saved to User"});
					});
			});

		});
	});



	/**
		*@api {get} /api/v1/city/:city_name Get's info about city with name : city_name
		*@apiName getCityInfo
		*@apiGroup mSA
		*
		*@apiSuccess {json} data Haven't yet decided
		*@apiSuccessExample {json} Success-Response:
		*	  {data : }
		*
		*@apiError 400 BAD REQUEST
		*@apiError 401 Authorization Failed
		*@apiError 500 Internal Server Error
		*@apiErrorExample {json} Error-Response:
		*     {message: ERROR_MESSAGE }
		*/	
	app.route("/api/v1/city/:city_name")
		
		.get(tools.authenticateUser, function(req,res){

			var requestCity = req.params.city_name;
			
			//do a request to DB_Server to get info about city
			rp(DB_SERVER_URL + "/api/v1/city/" + requestCity)
				.then(function(city){
					
					var request_ids = [];
					city = JSON.parse(city);

					//now get the request from every zone
					for (var i = 0; i < city.zones.length; i++)
						request_ids.push(city.zones[i].requests)
					var merged_list = [].concat.apply([], request_ids);

					var options = {
						uri : DB_SERVER_URL + "/api/v1/request/list",
						method : "POST",
						body  :  merged_list,
						json  : true
					}

					rp(options)
						.then(function(requests){
							handleRequests(requests,city.location, city.zones,req,res)	

						})
						.catch(function (err){
						console.log("Error While trying to gather info about city :" + err.message);
						res.status(500).send("Sorry something went wrong");
						return;	
				});

				})
				.catch(function (err){
					console.log("Error While trying to gather info about city :" + err.message);
					res.status(500).send("Sorry something went wrong");
					return;	
				});

		});	


	function handleRequests(requests,location,zones,req,res){
		var timeGraphAr = [];
		var queryData 	= {};
		var notFound 	= {};
		var zonesInfo  	= {};
		
		//get query - #nof queries object
		for(var i = 0; i < requests.length; i ++){
			var rqs = requests[i];
			var needToInit = true;
			
			//gather queries and their freq
			if (!queryData[rqs.query])
				queryData[rqs.query] = 0
			queryData[rqs.query] ++;

			rqs.date = new Date(rqs.date);
			//Find nof queries made in each date
			for (var j = 0; j < timeGraphAr.length; j ++){ //check if we have such a date
				var entry = timeGraphAr[j]
				if (isSameDay(entry.timestamp,rqs.date)){
					needToInit = false;
					timeGraphAr[j].requests++;
					break;
				}
			}
			if (needToInit)
				timeGraphAr.push({ timestamp : rqs.date, requests : 1});
			
			if (!rqs.googleResults[0]){
				if (!notFound[rqs.query])
					notFound[rqs.query] = 0;
				notFound[rqs.query]++;
			}

			updateZoneData(rqs,zones,zonesInfo)
		}

		var qry,zone;
		//create an array out of zonesInfo object
		var zonesAr = [];
		var i = 0;
		for (zone in zonesInfo){
			var qryAr = [];
			var failAr = [];
			//first create array out of zone querries
			for (qry in zonesInfo[zone].queries){
				qryAr.push([qry,zonesInfo[zone].queries[qry][0]])
				if (zonesInfo[zone].queries[qry][1] != 0)
					failAr.push([qry,zonesInfo[zone].queries[qry][1]])
			}
			zonesAr.push({	name 		: "Zone" + i++,
						 	nofReqs 	: zonesInfo[zone].nofRequests,
						 	queries 	: qryAr,
						 	mostNeeded 	: failAr,
						 	location 	: zonesInfo[zone].location});

		}

		//format time
		for (i = 0; i < timeGraphAr.length; i++){
			timeGraphAr[i].timestamp = timeGraphAr[i].timestamp.getTime();
			
		}

		var qryChart = [];
		for (qry in queryData)
			qryChart.push([qry, queryData[qry]])
		var notFoundAr = [];
		for (qry in notFound)
			notFoundAr.push([qry, notFound[qry]])

		res.send({	city : { queries    : qryChart,
							 timegraph  : timeGraphAr,
							 mostNeeded : notFoundAr,
							 location   : location
							},
					zones:	zonesAr
				});

	}


	function updateZoneData(rqs,zones,zonesInfo){
		//see in which zone this request belongs to
		for (i = 0; i < zones.length; i++)
			if (zones[i].requests.indexOf(rqs._id) > -1){
				var thisZone = zones[i];
				break;
			}

		//if request out of zone return	
		if (!thisZone) return;	
		
		var zone = thisZone.name;
		//if zone isn't initialized do it
		if (!zonesInfo[zone]) 
			zonesInfo[zone] = {
				nofRequests : 0,
				queries		: {}, //this includes [type, nof, nof_no_answer]
			};
		
		//add one more request here
		zonesInfo[zone].nofRequests++;



		if (!zonesInfo[zone].queries[rqs.query])
			zonesInfo[zone].queries[rqs.query] = [0,0];
		
		zonesInfo[zone].queries[rqs.query][0]++;
		zonesInfo[zone].location = thisZone.location; 
		if (!rqs.googleResults[0])
			zonesInfo[zone].queries[rqs.query][1]++;		

	}



	/**
			@name isSameDay
			@info This function checks if two dates are the same
			@params date1 : 1st date to be checked
					date2 : 2nd date to be checked
			@output (boolean) 	True if dates are the same 
								false if not		

	*/
	function isSameDay (date1,date2){
		
		return (date1.getDate() == date2.getDate() 
		&& date1.getMonth() == date2.getMonth()
		&& date1.getFullYear() == date2.getFullYear())
	}
	

	/**
		*@api {get} /api/v1/request/:query Get's info and statistics about a query
		*@apiName getQueryInfo
		*@apiGroup mSA
		*
		*@apiSuccess {json} data Haven't yet decided
		*@apiSuccessExample {json} Success-Response:
		*	  {data : }
		*
		*@apiError 400 BAD REQUEST
		*@apiError 401 Authorization Failed
		*@apiError 500 Internal Server Error
		*@apiErrorExample {json} Error-Response:
		*     {message: ERROR_MESSAGE }
		*/	
	app.route("/api/v1/request/:query")
		.get(tools.authenticateUser, function(req,res,next){
			var qry = req.params.query;
			rp(DB_SERVER_URL + "/api/v1/request/" + qry)
			.then(function(rqst){
				var requests = JSON.parse(rqst);
				
				var reqCity = {};
				var cities = {}	
				for (var i = 0; i < requests.length; i++){
					var rqs = requests[i];
					
					//gather queries and their freq
					if (!reqCity[rqs.city]){
						reqCity[rqs.city] = 0;
						cities[rqs.city] = {
							queries 	: 0,
							answers 	: 0,
							notFound 	: 0
						}
					}
					cities[rqs.city].queries++;
					cities[rqs.city].answers += rqs.googleResults.length;
					
					if (!rqs.googleResults[0])
						cities[rqs.city].notFound++;	

					reqCity[rqs.city] ++;
				}		

				var qryAr = [];
				for (entity in reqCity){
					qryAr.push([entity, reqCity[entity]])
					cities[entity].answers = cities[entity].answers/ cities[entity].queries; 
				}
				qryAr.sort(function(a,b){
					if (a[1] < b[1])
						return 1;
					else if (a[1] > b[1])
						return -1;
					return 0;
				})

				res.send({
					barChart : qryAr,
					cities   : cities
				});
			})
			.catch(function(error){
				console.log("Error in /api/v1/request/:query for query " + qry + " : " + error);
				res.status(500).send("Sorry something went wrong");
			})
		})


	app.route('/api/v1/user/logout')
		/**
		*@api {get} /api/v1/user/logout Logs user out of the session
		*@apiName UserLogout
		*@apiGroup User
		*
		*
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
		.get(function(req,res){
				req.logout();
				console.log("User logged out");
				res.send({message : "User successfully logged out"})
				return
		})



	




}
