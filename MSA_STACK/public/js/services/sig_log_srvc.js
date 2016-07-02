angular.module('mySearch_Analytics')
//service for signup
.factory('signupSrvc', ["$resource", function($resource){
    var response = {
          signup: function (username, email, password, name, surname, age){

          //object to send with post request
          var objToSend = {email : email, username: username, password: password, name : name, surname : surname, age : age};
          
          return $resource("/api/v1/signup").save({}, objToSend).$promise; //Use promise to handle response in controller
    }};
    return response;
}]);


angular.module('mySearch_Analytics')
//service for login
.factory('loginSrvc', ["$resource", function($resource){
    var response = {
        login: function (username, password){

          var objToSend = {username: username, password: password}
          return $resource("/api/v1/login").save({}, {username: username, password: password}).$promise; 
    }};
    return response;
}]);

