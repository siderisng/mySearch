angular.module('mySearch')
.controller('userCtrl',['$scope','userInfo','$state', '$window',"Notification",
	function($scope, userInfo, $state,$window,Notification){
	//init variables
	$scope.edit ={}





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
        if ($scope.edit.password != $scope.edit.passwordRep){
        	Notification.error("Passwords don't match")
        	return;
        }
        var changes = $scope.edit;    

        userInfo.editInfo(changes)
            .success(function(resp){
                 copyObject(changes, $scope.user);
                $state.go('menu.info')
            })
            .error(function(err){
                Notification.error(err.errorMessage)
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


//used to copy newly edited user info to display correctly
function copyObject(objA, objB){

    for (attr in objA){
        if (objA[attr])
            objB[attr] = objA[attr]
    }

}
