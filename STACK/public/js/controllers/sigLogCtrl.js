/*!
	controller to handle user signup and login
*/
angular.module('mySearch')
	.controller('homeCtrl',['$scope','loginSrvc','signupSrvc', '$state','$window', 
		function($scope, loginSrvc, signupSrvc, $state,$window){
		
		$scope.registerBool = false;

		//login user in function
		$scope.login = function(){


			loginSrvc.login($scope.usernameLog,$scope.passwordLog)
				.then(
			        function(resp){
			        	//set to true when user is logged in
			        	$state.go("menu")
			        },
			        function(err){
			           notie.alert(3, "Username or password is wrong", 2.5);
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
				        	$state.go("menu")
				        },
				        function(err){
				           	
			        	   notie.alert(3, "Couldn't register user. Check your data and try again", 2.5);
							$scope.passwordRep = "";
							$scope.password    = "";
				        }
				    )
			}else {
				$scope.passwordRep = "";
				$scope.password    = "";
				notie.alert(3, "Passwords don't match", 2.5);

			}
  		}

  		
  		$scope.register = function (){
        	$scope.registerBool = !$scope.registerBool;
    	};

  		
}])