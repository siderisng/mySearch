/////////////////////////////////////////////////////////////
//////////AUTHORS :   chocof (https://github.com/chocof)/////
//////////File :  app/api/userApi.js             /////////
/////////////////////////////////////////////////////////////


var City = require('../models/cityModel');        	///City Model
var Request = require('../models/requestModel');    ///Request model for getting request info
 
module.exports = function(app) {


	app.route("/api/v1/request")
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

	app.route("/api/v1/request/list")
		.post(function(req,res){
			var ids = req.body;
			
			Request.find({_id : { $in: ids}},function(err,requests){
				if (err){
					console.log("An Error Happened while finding list of requests " + err.message);
					res.status(500).send({errorMessage : "Couldn't retrieve requests :" + err.message});
				}
				res.setHeader('Content-Type', 'application/json');
				res.send(requests);
			});	

		})	

	app.route("/api/v1/city")
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
					res.send({message : "City " + city.name + " has been updated"})
				});
			});
		});
}
