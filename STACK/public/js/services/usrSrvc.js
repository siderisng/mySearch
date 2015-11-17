angular.module('mySearch')
.factory('userInfo', ["$http","$location", function($http,$location){
   
    return  {
      getInfo : function (){
          return $http.get("/api/v1/user"); 
    	},

    	editInfo : function (objectToEdit){
          return $http.post("/api/v1/user", objectToEdit); 
    	},

      getData  : function (){
        return $http.get("/api/v1/user/statistics");
      },

		  logout : function(){
			  return $http.get("/api/v1/user/logout");
		  },
      checkIfLoggedIn : function (){
          return $http.get("/api/v1/user"); 
      }    	
	}
    
}]);
