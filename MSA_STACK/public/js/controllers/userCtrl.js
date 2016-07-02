angular.module('mySearch_Analytics')
.controller('userCtrl',['$scope','userInfo','$state', '$window',"Auth",'$loading',
	function($scope, userInfo, $state,$window,Auth,$loading){
		

		$scope.status = {
			isopen: false
		};
		$scope.toggleDropdown = function($event) {
			$event.preventDefault();
			$event.stopPropagation();
			$scope.status.isopen = !$scope.status.isopen;
		};
		$scope.queryTypes = userInfo.queryList;
		$scope.isCollapsed = true;
		$scope.searchComplete = false;
		$scope.gotData = false;
		$scope.thisState = "";
		$scope.edit 	 = {};
		$scope.cities = [];
		$scope.pieChart = {};
		$scope.notFoundChart = {};
		var searchChoice = "";
		var searchCityChoice = "";
		var map= {};
		var dateGraphConf = userInfo.chartObj;
		$scope.qCities = [];
		var searchForCity;
		$scope.topRequests = [];

		//Inits user info
		$scope.__init__ = function(){
			$scope.user= {}
			userInfo.getInfo()
				.success(function(resp){
					//Preview User Data
					if (resp.info)
						$scope.user = resp.info;
					else return;
					if (resp.topRequests)
						$scope.topRequests = resp.topRequests.splice(0,5);
					$scope.expires = resp.info.expDate
					$scope.cities = resp.cities;
					if ($scope.thisState === '')
						$state.go('menu.info')
					
				})
				.error(function(err){
					if (err && err.errorMessage === "Looks Like you are out of months"){
						$scope.broke = true;
						$state.go('menu.member')	
						return;
					}
					$state.go('site')
				 })

		}

		//Sets current state. Useful for info management
		$scope.setState = function(state){

			if(state === "stats"){
				$scope.gotData = false;
				$scope.notFoundChart = {};
				$scope.searchComplete = false;
				$scope.pieChart = {};
				zonesPlot = [];
				map= {};
				if (searchForCity){
					$scope.gotData = true;
					var city = searchForCity;
					searchForCity = undefined;
					$scope.thisState = state;	
					$scope.findSelected(city);
				}
				
			}else{
				$scope.isCollapsed = true;
				$scope.searchComplete = false;
			}
			$scope.thisState = state;	

		}

		//Erase data from this city
		$scope.changeCity = function(){

			$scope.gotData = false;
			$scope.isCollapsed=true;
			map = {};
		}
		

		//Edits user info
		$scope.editInfo = function(){
			if ($scope.edit.password != $scope.edit.passwordRep){
				notie.alert(2, "Passwords don't match try again", 1.5);
				return;
			}
			var changes = $scope.edit;    

			userInfo.editInfo(changes)
				.success(function(resp){
					copyObject(changes, $scope.user);
					$scope.edit = {}; 
					notie.alert(4, "Changes Saved!", 2);
					$state.go('menu.info')
				})
				.error(function(err){
					$scope.edit.password 	= ""
					$scope.edit.passwordRep = ""
					notie.alert(3, err.errorMessage, 2.5);
				 })

		}


		//Logs user out
		$scope.logout = function(){
			notie.confirm('Are you sure you want to do that?', 'Yes', 'Cancel', function() {
				notie.alert(1, 'See you soon!', 2);

				userInfo.logout()
					.success(function(resp){
						Auth.remove();
						$state.go('site')
					})
					.error(function(err){
						notie.alert(3, err.errorMessage, 2.5);
					})
				});
		}


		//Search for city
		$scope.updateUserCityChoice = function (typed){
			searchChoiceCity = typed;
		}
		$scope.searchForCity = function(){

			if ($scope.cities.indexOf(searchChoiceCity) < 0){
				notie.alert(3, "We can make searches only for the provided queries. Please try something else", 2.5);
				return;
			}
			$scope.findSelected(searchChoiceCity);			
		}

	
		//finds info about selected city
		$scope.findSelected = function(city){
			userInfo.getCityData(city)
					.success(function(resp){

						plotCityTab(resp.city);	
						$scope.zones = resp.zones;	
						$scope.gotData = true;
						$scope.selectedCity = city;
						$scope.isCollapsed=false;
					})
					.error(function(err){
						if (err)
							notie.alert(3, err.errorMessage, 2.5);
					})
		}

		//Plots graph for city
		function plotCityTab(qrs){
			$scope.pieChart['pieChart'] = c3.generate({
				data: {
					columns: qrs.queries,
					type : 'pie'
				},
				size: {width:500},
				bindto : '#pieChart'
			});


			$scope.notFoundChart['notFoundChart'] = c3.generate({
				data: {
					columns: qrs.mostNeeded,
					type : 'bar'
				},
				size: {width:900},
				bindto : '#notFoundChart'
			});

			//format to date
			for (i = 0; i < qrs.timegraph; i++){
				qrs.timegraph[i].timestamp = new Date(qrs.timegraph[i].timestamp)
			}
			dateGraphConf.data.json = qrs.timegraph;
			$scope.dateGraph = c3.generate(dateGraphConf)
			
			plotMap('cityMap',qrs.location)
		}


		//Gets info about zones
		$scope.getZoneInfo = function(zone){
			if ( map['map_' + zone.name] ) return;
			
			plotMap('map_' + zone.name, zone.location, 
				{scrollwheel: false,
			    navigationControl: false,
			    mapTypeControl: false,
			    scaleControl: false,
			    draggable: false,})

			$scope.pieChart[zone.name] = c3.generate({
				data: {
					columns: zone.queries,
					type : 'pie'
				},
				size:{width:400},
				bindto : '#reqSuccess_' + zone.name
			});


			$scope.notFoundChart[zone.name] = c3.generate({
				data: {
					columns: zone.mostNeeded,
					type : 'bar'
				},
				size:{width:400},
				bindto : '#reqFail_' + zone.name
			});

		}

		//Same thing but for queries
		$scope.updateUserChoice = function (typed){
			searchChoice = typed;
		}
		$scope.searchQuery = function(){
			if ($scope.queryTypes.indexOf(searchChoice) < 0){
				notie.alert(3, "We can make searches only for the provided queries. Please try something else", 2.5);
				return;
			}
			userInfo.searchQuery(searchChoice)
				.success(function(resp){
					
					plotQuery(resp);
					$scope.searchComplete = true;
				})
				.error(function(err){
					if (err)
						notie.alert(3,err.errorMessage,2.5)
				})

		}


		//Plots map
		function plotMap(elem_id, bounds_loc,options){
			//create map
			var northeast = new google.maps.LatLng(bounds_loc.northeast.latitude,bounds_loc.northeast.longitude)
			var southwest = new google.maps.LatLng(bounds_loc.southwest.latitude,bounds_loc.southwest.longitude)	
					
			var bounds = new google.maps.LatLngBounds();
			bounds.extend(northeast);
			bounds.extend(southwest);
			map[elem_id] = {}
			map[elem_id] = new google.maps.Map(document.getElementById(elem_id), options);

			map[elem_id].fitBounds(bounds);
		}

		function plotQuery(resp){
			$scope.qryCityBar = c3.generate({
				data: {
					columns: resp.barChart,
					type : 'bar'
				},
				bindto : '#qryCityBar'
			});
			$scope.qCityInfo = resp.cities;
			$scope.qCities = [];
			resp.barChart.forEach(function(a){
				$scope.qCities.push(a[0]);
			})
		}

		$scope.changeQuery = function(){
			$scope.searchComplete = false;
		}

		$scope.statsCity = function(city){
			searchForCity = city;
			$state.go('menu.stats')
			
			
		}

}]);


//used to copy newly edited user info to display correctly
function copyObject(objA, objB){

	for (attr in objA){
		if (objA[attr])
			objB[attr] = objA[attr]
	}

}
