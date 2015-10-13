angular.module('mySearch')
.controller('userCtrl',['$scope','userInfo',function($scope, userInfo){
	//init variables
	
	//Inits user info
	$scope.__init__ = function(){
		$scope.user= {}
		userInfo.getInfo()
			.success(function(resp){
	         	//Preview User Data
	        	$scope.user = resp.info;
	        	console.log($scope.user)

	        })
			.error(function(err){
		        console.log(err)   	
		    })

	}


}]);