/////////////////////////////////////////////////////////////
//////////AUTHORS :   chocof (https://github.com/chocof)/////
//////////File :  app/api/userApi.js             /////////
/////////////////////////////////////////////////////////////


var User = require('../models/userModel');        ///User's Model

module.exports = function(app,passport,tools, privateData) {


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
 


				var jsonToSend = {
					info : {

						email 	 : user.email,
						username : user.username,
						name     : user.name,
						surname  : user.surname,
						age 	 : user.age 
					}
				};

				res.send(jsonToSend);
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

				//set new attributes
				var toChangeAttrs = req.body; 
					
				var arrayOfAllowedAttrs = ['username','email','name','surname','age'];	

				for (attr in toChangeAttrs){
					//if user wants to change password
					if (attr === 'password'){
						user.password = User.generateHash(toChangeAttrs[attr]);
						continue;
					}
					//else set normally
					if (arrayOfAllowedAttrs.indexOf(attr) >= 0 && toChangeAttrs[attr] && toChangeAttrs[attr] != "")
						user[attr] = toChangeAttrs[attr];

					//check for malicius use
					else if ((attr === 'id')||(attr === '_id'))
						console.log("User with email " + user.email + " and username " 
							+ user.username + " is trying to change his id.");

				}
				
				//save user
				user.save(function(req, res){
					if (err){
						console.log("Getting User Info  Error : ",e.message)
		      	    	res.status(500).send({errorMessage : err.message})
						return;
					}

					res.send({successMessage : "Changes Saved to User"});
				});
			});
		});


	app.route('api/v1/user/history/location')


		.get(tools.authenticateUser, function(req,res){

			User.findById(req.user, function(err,res){
				if (err){
					console.log("Getting User History Error : ",e.message)
	      	    	res.status(500).send({errorMessage : err.message})
					return;

				}

				res.send({history : user.locationHistory})


			})

		})
	

	app.route('api/v1/user/history/searches')


	.get(tools.authenticateUser, function(req,res){

		User.findById(req.user, function(err,res){
			if (err){
				console.log("Getting User History Error : ",e.message)
      	    	res.status(500).send({errorMessage : err.message})
				return;

			}

			res.send({history : user.searchesHistory })


		})

	})
	
}
