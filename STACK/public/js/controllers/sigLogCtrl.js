/*!
	controller to handle user signup and login
*/
angular.module('mySearch')
	.controller('homeCtrl',['$scope', "Notification",'loginSrvc','signupSrvc', '$state','$window', 
		function($scope, Notification, loginSrvc, signupSrvc, $state,$window){
		
		$scope.registerBool = false;

		//login user in function
		$scope.login = function(){


			loginSrvc.login($scope.usernameLog,$scope.passwordLog)
				.then(
			        function(resp){
			        	//set to true when user is logged in
			        	$window.localStorage.setItem('auth',true);
			           	$state.go("menu")
			        },
			        function(err){
			           Notification.error(err.data.errorMessage);
			        }
			    )
  		}

  		
  		$scope.signup = function(){

  			//check if passwords are the same
  			if ($scope.password === $scope.passwordRep){
  			
  				

				signupSrvc.signup($scope.username, $scope.email, $scope.password, $scope.name, $scope.surname, $scope.age)
					.then(
				        function(resp){
				 			//set to true when user is logged in
				 			$window.localStorage.setItem('auth',true);
				        	$state.go("menu")
				        },
				        function(err){
				           	
				        	Notification.error(err.data.errorMessage)
							$scope.passwordRep = "";
							$scope.password    = "";
				        }
				    )
			}else {
				$scope.passwordRep = "";
				$scope.password    = "";
				Notification.error("Passwords Don't Match!!!");
				
			}
  		}

  		
  		$scope.register = function (){
        	$scope.registerBool = !$scope.registerBool;
    	};

  		
}])