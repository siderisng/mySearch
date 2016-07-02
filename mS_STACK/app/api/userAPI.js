/////////////////////////////////////////////////////////////
//////////AUTHORS :   chocof (https://github.com/chocof)/////
//////////File :  app/api/userApi.js             /////////
/////////////////////////////////////////////////////////////


/**
	Basic REST API for website Users
	It provides core functions like login ,signup
	info edit etc. /api/v1/user/statistics is also implemented 
	here.

*/


//Url of database server
const DB_SERVER_URL   = "http://localhost:8500"
//Maximum numbers of requests to be served for map object
const NOF_MAP_REQ	  = 21;

//for http requests
var rp = require('request-promise');
var User = require('../models/userModel');        ///User's Model
var Request = require('../models/requestModel');     ///Request's model for getting request info
 
module.exports = function(app,passport,tools, privateData) {
	

	//Used for signing up user in the application
	app.route('/api/v1/signup')
	
		/**
		*@api {post} /api/v1/signup Registers user to the website
		*@apiName UserSignUp
		*@apiGroup User
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
					console.log('[+]User with email '+user.email+' successfully signed up!!!')
					//save him to db	
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
		*@apiParam {json} userData User's username or email in the field username and password on password
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
 	
 				//Gather data to send
				var jsonToSend = {
					info : {

						email 	 : user.email,
						username : user.username,
						name     : user.name,
						surname  : user.surname,
						age 	 : user.age 
					}
				};

				//Send
				res.send(jsonToSend);
			})


		})



		/**
		*@api {post} /api/v1/user Sets user information
		*@apiName UserSetInfo
		*@apiGroup User
		*
		*@apiParam {json} toChangeAttrs Attributes to change for user
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

					//Save user
					user.save(function(req, user){
						if (err){
							console.log("Getting User Info  Error : ",e.message)
							res.status(500).send({errorMessage : err.message})
							return;
						}
						//Send response
						res.send({successMessage : "Changes Saved to User"});
					});
			});

		});
	});
	


	app.route('/api/v1/user/statistics')	
		/**
		*@api {get} /api/v1/user/statistics Returns a list of data ready to be plotted(graphs,maps,etc)
		*@apiName userStats
		*@apiGroup User
		*
		*@apiHeaderExample {json} Header-Example: 
		*	{
		*		"authorization": "username=<user_username>&sessionCode=<code_we_gave_you_in_login>"
		*	}
		*
		*@apiSuccess {String} successMessage Success message
		*@apiSuccessExample {json} Success-Response:
		*	  
		*		{
		*				graph 		:  Array_dates-nofRequest_in_dates,
		*				chart 		:  Array_queries-nofRequest_to_these_queries,
		*				cities 		:  cities,
		*				maps		:  locations,
		*				maxCity		:  City_with_most_requests	
		*			
		*		}
		*
		*@apiError 400 BAD REQUEST
		*@apiError 401 Authorization Failed
		*@apiError 404 Couldn't find user
		*@apiError 500 Internal Server Error
		*@apiErrorExample {json} Error-Response:
		*     {errorMessage: ERROR_MESSAGE }
		*/
		.get(tools.authenticateUser, function(req, res, next){
			
			//first find user
			User.findById(req.user, function(err,user){
				if (err){
					res.status(500).send({errorMessage : "An Error Happened" + err.message})
					return;
				}


				//Send an http post to get all the requests
				var options = {
				    method: 'POST',
				    uri: DB_SERVER_URL + "/api/v1/request/list",
				    body: user.requestHistory,
				    json: true 
				};	
				rp(options)
				.then(function(listOfRequests){

					if (!listOfRequests[0]){
						res.status(404).send({errorMessage : "Seems like you don't have any requests"})
						return;
					}

					//Create pie chart array
					var pieChart = [];
					//create object to populate
					var pieChartObj = {};

					//create graph representation array
					var timeGraphAr = [];
					
					//create city array 
					var locations = [];

					//create location array for maps
					var cities = {};

					//booleans checking if there 
					//is a need to create new date obj
					for (var i = 0; i < listOfRequests.length; i ++){
						var rqs = listOfRequests[i];
						var needToInit 	= true;

						rqs.date = new Date(rqs.date);
						//Find nof queries of each type for the pie chart
						if (!pieChartObj[rqs.query])
							pieChartObj[rqs.query] = 0;
						pieChartObj[rqs.query]++;
						
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
								
						//add new city
						if (!cities[rqs.city])
							cities[rqs.city] = { name : rqs.city , count : 1, location : rqs.location};
						else 
							cities[rqs.city].count ++ ;

						//add only 20 req locations
						//The requests are sorted. So we get the 20 latest requests
						if (listOfRequests.length - i < NOF_MAP_REQ)
							locations.push([rqs.city + ',' + rqs.country + ', searched for : ' + rqs.query,rqs.location.longitude,rqs.location.latitude])
					}

					//format time
					for (i = 0; i < timeGraphAr.length; i++){
						timeGraphAr[i].timestamp = timeGraphAr[i].timestamp.getTime();
						
					}
					//now pass to array in c3js form 
					for (qry in pieChartObj)
						pieChart.push([qry, pieChartObj[qry]])


					//Find city with most requests
					var max ={ count : -1};
					//Array with all the cities and count of requests in them
					var cityArr = [];
					for (city in cities){

						cityArr.push([cities[city].name, cities[city].count]);
						if (max.count < cities[city].count)
							max = { count :cities[city].count,
									name : cities[city].name,
									location : cities[city].location};
					}

					//send object
					res.send({
						graph 		:  timeGraphAr,
						chart 		:  pieChart,
						cities 		:  cityArr,
						maxCity		:  max,
						maps		:  locations	
					});
					return;
				})
				.catch(function (err){
					console.log("Error while getting list of users requests :" + err.message);
					res.status(500).send({errorMessage : "An Error Occured :" + err.message});	
				});
			});
		});


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
		.get(tools.authenticateUser,function(req,res){
				req.logout();
				console.log("User logged out");
				res.send({message : "User successfully logged out"})
				return
		})


}
