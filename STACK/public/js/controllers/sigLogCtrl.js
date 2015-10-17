/*!
	controller to handle user signup and login
*/
angular.module('mySearch')
	.controller('homeCtrl',['$scope', "Notification",'loginSrvc','signupSrvc', '$state', function($scope, Notification, loginSrvc, signupSrvc, $state){
		
		$scope.registerBool = false;

		//login user in function
		$scope.login = function(){

			//hash password first
			var hashedPwd = hashPwd($scope.passwordLog)

			loginSrvc.login($scope.usernameLog,hashedPwd)
				.then(
			        function(resp){
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
  			
  				var hashedPwd = hashPwd($scope.password)

				signupSrvc.signup($scope.username, $scope.email, hashedPwd, $scope.name, $scope.surname, $scope.age)
					.then(
				        function(resp){
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

  		function hashPwd(password){

  			var hashed = CryptoJS.MD5(password);
    		return (hashed.toString(CryptoJS.enc.Base64));
  		}

  		$scope.register = function (){
        	$scope.registerBool = !$scope.registerBool;
    	};

  		
}])