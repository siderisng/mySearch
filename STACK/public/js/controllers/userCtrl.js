angular.module('mySearch')
.controller('userCtrl',['$scope','userInfo','$state', '$window',
	function($scope, userInfo, $state,$window){
	//init variables
	$scope.edit ={
		username 	: "",
		surname 	: "",
		email 		: "",
		password	: "",
		name 	 	: "",
		age			: ""	
	}


	//Inits user info
	$scope.__init__ = function(){
		$scope.user= {}
		userInfo.getInfo()
			.success(function(resp){
	         	//Preview User Data
	         	$scope.user = resp.info;
	        	$state.go('menu.info')
			})
			.error(function(err){
		        $state.go('site')
	         })

	}

	//Inits user info
	$scope.editInfo = function(){
		userInfo.editInfo($scope.edit)
			.success(function(resp){
	         	//Print message to user
	         	
			})
			.error(function(err){
		        //Print message to user
	         })

	}

	//Inits user info
	$scope.logout = function(){
		userInfo.logout()
			.success(function(resp){
				$window.localStorage.removeItem("auth");
				$state.go('site')
			})
			.error(function(err){
		     })

	}


}]);