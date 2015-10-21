angular.module('mySearch')
.factory('userInfo', ["$http", function($http){
   
    return  {
        getInfo : function (){

          return $http.get("/api/v1/user"); 
    	},

    	editInfo : function (objectToEdit){

          return $http.post("/api/v1/user", objectToEdit); 
    	},

		logout : function(){
			return $http.get("/api/v1/user/logout");
		}    	
	}
    
}]);
