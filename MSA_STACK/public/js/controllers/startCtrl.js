/*!
	controller to handle user signup and login
*/
angular.module('mySearch_Analytics')
	.controller('homeCtrl',['$scope','loginSrvc','signupSrvc', '$state','$window', 
		function($scope, loginSrvc, signupSrvc, $state,$window){
		
		$scope.registerBool = false;
		

		//login user in function
		$scope.login = function(){


			loginSrvc.login($scope.usernameLog,$scope.passwordLog)
				.then(
			        function(resp){
			           	$state.go("menu")
			        },
			        function(err){
			          	notie.alert(3, "Username or password is wrong", 2.5);
			        	
			        }
			    )
  		}

  		
  		$scope.signup = function(){

  			//check if passwords are the same
  			if ($scope.password === $scope.passwordRep && $scope.password.length >= 6  && $scope.username.length >= 3){
  			
  				

				signupSrvc.signup($scope.username, $scope.email, $scope.password, $scope.name, $scope.surname, $scope.age)
					.then(
				        function(resp){
				        	notie.alert(1, "You succesfully signed up in mySearch Analytics. The first 3 months are on us. Have fun", 2.5)
				        	$state.go("menu")
				        },
				        function(err){
				           	notie.alert(3, "Couldn't register user. Check your data and try again", 2.5);
							$scope.passwordRep = "";
							$scope.password    = "";
				        }
				    )
			}else {
				
				if ($scope.password.length < 6)
					notie.alert(3, "Password must be more than 6 characters", 2.5);
			 	else if ($scope.username.length < 3)
			 		notie.alert(3, "Username must be more than 3 characters", 2.5);
			 	else
					notie.alert(3, "Passwords don't match", 2.5);
				$scope.passwordRep = "";
				$scope.password    = "";
			 	}
  		}

  		
  		$scope.register = function (){
        	$scope.registerBool = !$scope.registerBool;
    	};

  		
}])