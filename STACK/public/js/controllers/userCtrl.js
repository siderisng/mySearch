angular.module('mySearch')
.controller('userCtrl',['$scope','userInfo','$state','Auth',
	function($scope, userInfo, $state,Auth){
	//init variables
	$scope.edit ={};
	$scope.gotData = false;
	$scope.graph = {};
	$scope.chart = {};
	$scope.cities  = {};
	$scope.maps  = {};
	$scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };
	var dateGraphConf = {
		bindto : '#dateGraph',
		axis : {
			x : {
				type:"timeseries",
				tick: {
					format:"%d/%m/%y"
				},
				label: "Date"    
			},
			y : {
				label: {
					text :"#Requests",
					position : "outer-middle"
				}
			}
		},
		grid :{
			x: {
				show : true
			},
			y :{
				show : true
			}
		},
		data : {

			keys : {
				x : 'timestamp',
				value : ['requests']
			}
		},
		//for our legend
		legend : {
			position : "right",
			inset: {
				anchor: 'top-left',
				x: 20,
				y: 10,
				step: 3
			}
		},
		//enable zoom
		zoom : {
			enabled : true,
			rescale : true
		}
  }


	//Inits user info
	$scope.__init__ = function(){
		$scope.user= {}
		userInfo.getInfo()
			.success(function(resp){
				//Preview User Data
				$scope.user = resp.info;
				$state.go('menu.info')
				notie.alert(1, "Welcome Back " + $scope.user.username + "!", 1.5);
			})
			.error(function(err){
				$state.go('site')
			 })

	}

	//Inits user info
	$scope.editInfo = function(){
		if ($scope.edit.password != $scope.edit.passwordRep){
			notie.alert(3, "Passwords don't match", 2.5);
			return;
		}
		var changes = $scope.edit;    

		userInfo.editInfo(changes)
			.success(function(resp){
				copyObject(changes, $scope.user);
				$state.go('menu.info')
			})
			.error(function(err){
				notie.alert(3, err.errorMessage, 2.5);
			 })

	}





	$scope.gatherData = function(page){

		if (page == 'statistics')
			callback = createCharts;
		else if (page == 'maps')
			callback = createMap;
		if (!$scope.gotData)
			userInfo.getData()
				.success(function(data){
					$scope.gotData = true;
					console.log(data)
					copyObject(data,$scope);
					callback();
				})
				.error(function(err){
					notie.alert(3, err.errorMessage, 2.5);
				})
		else
			callback();

	}


	function createCharts(){
		//create pie chart 
		//type of searches/nofsearches
		
		$scope.pieChart = c3.generate({
			data: {
			// iris data from R
			columns: $scope.chart,
			type : 'pie'
			},
			bindto : '#pieChart'
		});

		//format to date
		for (i = 0; i < $scope.graph; i++){
			$scope.graph[i].timestamp = new Date($scope.graph[i].timestamp)
		}
		//add data to graph
		dateGraphConf.data.json = $scope.graph;
		$scope.dateGraph = c3.generate(dateGraphConf)
		
	}

	function createMap(){
		//create map
		var bounds = new google.maps.LatLngBounds();
		$scope.map = new google.maps.Map(document.getElementById('map'), {
		   center: new google.maps.LatLng(39.357493,22.950634),
			zoom : 5
		});
		

		var markers = $scope.maps;
		
		var infoWindow = new google.maps.InfoWindow(), marker, i;
		
		// Loop through our array of markers & place each one on the map  
		for( i = 0; i < markers.length; i++ ) {
			var position = new google.maps.LatLng(markers[i][1], markers[i][2]);
			bounds.extend(position);
			marker = new google.maps.Marker({
				position: position,
				map: $scope.map,
				title: markers[i][0]
			});
			
			// Allow each marker to have an info window    
			google.maps.event.addListener(marker, 'click', (function(marker, i) {
				return function() {
					infoWindow.setContent(markers[i][0]);
					infoWindow.open($scope.map, marker);
				}
			})(marker, i));

			// Automatically center the map fitting all markers on the screen
			$scope.map.fitBounds(bounds);
		}
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



}]);


//used to copy newly edited user info to display correctly
function copyObject(objA, objB){

	for (attr in objA){
		if (objA[attr])
			objB[attr] = objA[attr]
	}

}



