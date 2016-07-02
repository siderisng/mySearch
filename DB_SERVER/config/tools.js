/////////////////////////////////////////////////////////////
//////////AUTHORS :   chocof (https://github.com/chocof)/////
//////////File :   config/privateData.js  	   		/////////
/////////////////////////////////////////////////////////////

const SQUARE_SIZE = 0.001;

var City 	= require('../app/models/cityModel'); ///City's Model
var Request = require('../app/models/requestModel'); ///City's Model
var reqAr = [];

module.exports = {
	
	//Split To Zones is the algorithm in which we divide each city
	//to different areas it will be executed every 24 hours
	splitToZones : function(){
		
		console.log("============Started Splitting-In-Zones process============")
		//first get all the cities	
		City.find({},function(err,cities){
			if (err){
				console.log("Couldn't retrieve all the cities in splitToZones function(error :" + err.message+")");
				return;
			}
			else if (!cities[0]){
				console.log("There ain't no city in the database uh-ha");
				return;
			}

			var toSave = [];
			//Now that we have all the cities start	
			//processing
			processCity(cities,toSave);
		})
	},

	findMostCommon :function(){

		console.log("============Started Sorting Requests process============")
		Request.find({},function(err, requests){

			if (err){
				console.log("Something went wrong to findMostCommmon cronJob : " + err.message);
				return;
			}
			
			if (!requests[0]){
				console.log("Seems like we don't have any requests yet");
				return;
			}

			var reqObj = {};
			for (var i = 0; i < requests.length; i++){
				var req = requests[i];

				if (!reqObj[req.query])
					reqObj[req.query] = 0;
				reqObj[req.query]++;
			}

			reqAr = [];
			for (req in reqObj)
				reqAr.push([reqObj[req],req])
			reqAr.sort(sortReq)
			console.log("============Ended Sorting Requests process============")
		})

	},

	getRequestArray : function(){return reqAr;} 
};



function sortReq(a,b){
	if (a[0] < b[0])
		return 1;
	else if (a[0] > b[0])
		return -1;
	return 0;
}



/**
*	In this function we shall process city 
*   data and split every city in zones
*   @params stackToTemp is a stack with cities which we re gonna get requests from
*	@params stackToSave the stack with cities which we're gonna save
**/
function processCity(stackToTemp,stackToSave){


	//get the first city
	var thisCity = stackToTemp.pop();

	//If there are no more cities save data
	if (!thisCity){
		console.log("--------Now started Saving process--------");
		saveToDB(stackToSave, 
				function(city){
					console.log("City " + city.name + " has been saved")
				},
				function(){
					console.log("--------Finished Saving Entities--------")
					console.log("============Ended Splitting-In-Zones process============")
				}
			);
		return;
	}

	stackToSave.push(thisCity);

	console.log("Processing City " + thisCity.name);

	//Now get list of requests
	Request.find({_id : { $in: thisCity.listOfRequests}},function(err,requests){
		if (err){
			console.log("An Error Occured While Processing City " + city.name + " : " + err.message);
			return;
		}

		//if this city doesn't have any requests move on to next city
		if (!requests[0]){
			processCity(stackToTemp,stackToSave);
			return;			
		}

		//1. Get northeast southeast points
		var northeast = { x : +thisCity.location.northeast.longitude, y : +thisCity.location.northeast.latitude}
		var southwest = { x : +thisCity.location.southwest.longitude, y : +thisCity.location.southwest.latitude}
		
		//2. Calculate northwest and southeast points(in order to shape a rectangle)
		var northwest = {x : +southwest.x, y : +northeast.y};
		var southeast = {x : +northeast.x, y : +southwest.y};


		//3. Start The big loop. For every request find its zone
		//and assign it there
		for (var i = 0; i < requests.length; i++){

			var request = requests[i];
			//get requests coordinates
			var reqX 	= +request.location.longitude;
			var reqY 	= +request.location.latitude;
			var YLimit  = +northwest.y;
			
			//4. Find zones y
			while (YLimit > reqY) YLimit-=SQUARE_SIZE;

			var XLimit = +southeast.x;
	
			while (XLimit  > reqX) XLimit-=SQUARE_SIZE;

			//check if request is out of zone
			if (YLimit < southeast.y || XLimit < southwest.x)
				thisCity.outOfZone.push(request._id); 
			else{
				//Create the zone
				var zone = {
					location : {
						southwest : {longitude : XLimit, latitude : YLimit},
						northeast : {
							longitude : XLimit + SQUARE_SIZE,
						 	latitude : YLimit + SQUARE_SIZE
						 	}
					 	}
					};
				
				//Search if such zone exists
				for (var j = 0; j < thisCity.zones.length; j++){
					var entry = thisCity.zones[j];
					//if zone already exists add request there
					if (entry.location.southwest.longitude === zone.location.southwest.longitude
						&& entry.location.northeast.longitude === zone.location.northeast.longitude
						&&entry.location.southwest.latitude === zone.location.southwest.latitude
						&& entry.location.northeast.latitude === zone.location.northeast.latitude){
						
						entry.requests.push(request._id);	
						break;
					}
				}

				//if zone does not exists create new and add the request there
				if (j === thisCity.zones.length){
					zone.name = "Zone_"+j;
					zone.requests = [request._id]
					thisCity.zones.push(zone);
				}
			}
		}


		//Don't forget to delete these 
		thisCity.listOfRequests = [];

		processCity(stackToTemp,stackToSave)

	});
}

/**
*	saveToDB saves a stack of entities to the database
*   @params stack is the stack of entities to be saved
*	@params callback is a function to be executed when entity is saved (entity is argument)
**/
function saveToDB(stack,callback,callback_end){
	entity = stack.pop();
	if (entity)
		entity.save(function(err){
			if (err)
				console.log("Error While Saving Data : " + err.message);
			callback(entity);
			saveToDB(stack,callback,callback_end); 
		});
	else{
		callback_end();
	}
	
}
