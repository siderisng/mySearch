/////////////////////////////////////////////////////////////
//////////AUTHORS :   chocof (https://github.com/chocof)/////
//////////File :  app/api/dbApi.js                  /////////
/////////////////////////////////////////////////////////////


var City = require('../models/cityModel');        	///City Model
var Request = require('../models/requestModel');    ///Request model for getting request info
 
module.exports = function(app, tools) {


	app.route("/api/v1/request")
		/**
		*@api {post} /api/v1/request Create new request
		*@apiName createRequest
		*@apiGroup Request
		*
		*@apiParam {json} requestInfo Info of request to create
		*@apiParamExample {json} Request-Example:
		*    {
		*		country : country_where_request_was_made,
		*		city    : city_where_request_was_made,
		*		location : location_where_request_was_made,
		*		query    : what_user_searched_for,		
		*		googleResults : google_answer
		*		
		*			
		*	}
		*@apiSuccess {json} id New request id
		*@apiSuccessExample {json} Success-Response:
		*	  {id : new_request_id}
		*
		*@apiError 400 BAD REQUEST
		*@apiError 500 Internal Server Error
		*@apiErrorExample {json} Error-Response:
		*     {message: ERROR_MESSAGE }
		*/	
		.post(function(req,res){

			var requestData = req.body;
			var newReq = new Request({ country 			: requestData.country,
										city   			: requestData.city,
										location		: requestData.location,
										query			: requestData.query,
										googleResults 	: requestData.googleResults,
										date 			: Date.now()	
										});
			newReq.save(function(err){
				if (err){
					console.log("Couldn't Save new Request an error Happened :" + err.message);
					res.status(500).send({errorMessage : "An error occured : " + err.message})
					return;
				}
				res.send({id : newReq._id})
			})

		})

	app.route("/api/v1/request/sorted_list")
	/**
		*@api {get} /api/v1/request/sorted_list Get sorted list of most common requests
		*@apiName getSortedList
		*@apiGroup City
		*
		*
		*@apiSuccess {json} requests List of Requests 
		*@apiSuccessExample {json} Success-Response:
		*	 ['Request#1', 'Request#2', ... , 'Request#N']
		*
		*@apiError 400 BAD REQUEST
		*@apiError 500 Internal Server Error
		*@apiErrorExample {json} Error-Response:
		*     {errorMessage: ERROR_MESSAGE }
		*/		
	.get(function(req,res){

		res.send(tools.getRequestArray());
	})			

	app.route("/api/v1/request/list")
		
		/**
		*@api {post} /api/v1/request/list Get a list of requests
		*@apiName getRequestList
		*@apiGroup Request
		*
		*@apiParam {json} idarray Array of request idz
		*@apiParamExample {json} Request-Example:
		*    [ id_1, id_2, id_3, ... , id_n]
		*
		*@apiSuccess {json} listOfRequests List of requests specified
		*@apiSuccessExample {json} Success-Response:
		*	  [ request_1, request_2, ..., request_n]
		*
		*@apiError 400 BAD REQUEST
		*@apiError 500 Internal Server Error
		*@apiErrorExample {json} Error-Response:
		*     {message: ERROR_MESSAGE }
		*/	
		.post(function(req,res){
			var ids = req.body;
			Request.find({_id : { $in: ids}}).sort('-date').exec(function(err, requests) {
				if (err){
					console.log("An Error Happened while finding list of requests " + err.message);
					res.status(500).send({errorMessage : "Couldn't retrieve requests :" + err.message});
				}
				res.setHeader('Content-Type', 'application/json');
				res.send(requests);
			});	

		})	

	app.route("/api/v1/request/:query")
		
		/**
		*@api {post} /api/v1/request/:query Get a list of requests based on query
		*@apiName getRequestQuery
		*@apiGroup Request
		*
		*@apiSuccess {json} listOfRequests List of requests specified
		*@apiSuccessExample {json} Success-Response:
		*	  [ request_1, request_2, ..., request_n]
		*
		*@apiError 400 BAD REQUEST
		*@apiError 500 Internal Server Error
		*@apiErrorExample {json} Error-Response:
		*     {message: ERROR_MESSAGE }
		*/	
		.get(function(req,res){
			var qry = req.params.query;
			if (!qry) {
				res.status(400).send({errorMessage : "You shall add a query"})
				return;
			}
			Request.find({query : qry},function(err,requests){

				if (err){
					console.log("Error while searching for requests with query " + qry + "  : "  + err.message);
					res.status(500).send({errorMessage : err.message});
					return;
				}

				if (!requests[0]){
					res.status(404).send({errorMessage : "No requests found matching this query"});
					return;
				}

				res.send(requests);
			});	

		})		

	app.route("/api/v1/city")
		

		/**
		*@api {post} /api/v1/city Update city or create new city entity
		*@apiName updateCityInfo
		*@apiGroup City
		*
		*@apiParam {json} cityData City info
		*@apiParamExample {json} Request-Example:
		*    {
		*		name 		: city_name,
		*		location	: city_location,
		*		request		: request_made_to_city 		
		*	}
		*
		*@apiSuccess {String} successMessage Success message
		*@apiSuccessExample {json} Success-Response:
		*	  {successMessage : SUCCESS_MESSAGE}
		*
		*@apiError 400 BAD REQUEST
		*@apiError 500 Internal Server Error
		*@apiErrorExample {json} Error-Response:
		*     {message: ERROR_MESSAGE }
		*/		
		.post(function(req,res){

			var newCity = req.body;
			City.findOne({name : newCity.name},function(err,city){

				if (err){
					console.log("An error happened during searching for city : " + city);	
					res.status(500).send({errorMessage : "An Error Happened : " + err.message});
					return;	
				}

				//if this city doesn't already exist create it
				if (!city)
					city = new City ({
						name : newCity.name,
						location : {
						   	northeast: {
						   		longitude	: newCity.location.northeast.longitude,
								latitude 	: newCity.location.northeast.latitude
							},
							southwest : {
									longitude 	: newCity.location.southwest.longitude,
									latitude 	: newCity.location.southwest.latitude
							}
						}
					});
				//Now add new request to this city
				city.listOfRequests.push(newCity.request);

				//Finally save it : )
				city.save(function(err){
					if (err){
						console.log("Couldn't Save new City an error Happened :" + err.message);
						res.status(500).send({errorMessage : "An error occured : " + err.message})
						return;
					}
					res.send({successMessage : "City " + city.name + " has been updated"})
				});
			});
		});

	app.route("/api/v1/city/list")
		
		/**
		*@api {get} /api/v1/city/list Get list of available citiez
		*@apiName getCity
		*@apiGroup City
		*
		*
		*@apiSuccess {json} cities List of cities 
		*@apiSuccessExample {json} Success-Response:
		*	 ['city1', 'city2', ... , 'cityN']
		*
		*@apiError 400 BAD REQUEST
		*@apiError 500 Internal Server Error
		*@apiErrorExample {json} Error-Response:
		*     {errorMessage: ERROR_MESSAGE }
		*/		
		.get(function(req,res){

			City.find({}, function(err,cities){
				if (err){
					res.status(500).send({errorMessage : "An server Error occured : " + err.message});
					return;
				}
				if (!cities[0]){
					res.status(404).send({errorMessage : "Cities list is empty"});
					return;	
				}
				var cityAr = [];
				for (var i = 0; i < cities.length; i++){
					cityAr.push(cities[i].name);
				}
				res.send(cityAr)

			});
		});

	
	app.route("/api/v1/city/:city_name")
		
		/**
		*@api {get} /api/v1/city/:name Get info about specified city
		*@apiName getCity
		*@apiGroup City
		*
		*
		*@apiSuccess {json} city City Object
		*@apiSuccessExample {json} Success-Response:
		*	  {	
		*		name : city_name,
		*		location : city_location,
		*		zones 	: city_zones,
		*		listOfRequests : city_list_of_unsorted_requests
		*		}
		*
		*@apiError 400 BAD REQUEST
		*@apiError 500 Internal Server Error
		*@apiErrorExample {json} Error-Response:
		*     {errorMessage: ERROR_MESSAGE }
		*/	
		.get(function(req,res){

			City.findOne({name : req.params.city_name}, function(err,city){
				if (err){
					res.status(500).send({errorMessage : "An server Error occured : " + err.message});
					return;
				}

				if (!city){
					res.status(404).send({errorMessage : "Couldn't Find City " + req.params.city_name});
					return;	
				}

				res.send(city);
			});
		});

}
