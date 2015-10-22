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

	//used to copy newly edited user info to display correctly
	function copyObject(objA, objB){

        for (attr in objA){
            if (objA[attr])
                objB[attr] = objA[attr]
        }

    }

    //Inits user info
    $scope.editInfo = function(){
        var changes = $scope.edit;    

        userInfo.editInfo(changes)
            .success(function(resp){
                 copyObject(changes, $scope.user);
                $state.go('menu.info')
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