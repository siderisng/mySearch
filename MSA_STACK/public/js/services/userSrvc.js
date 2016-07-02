angular.module('mySearch_Analytics')
.factory('userInfo', ["$http", function($http){
   

    return  {
        getInfo : function (){
          return $http.get("/api/v1/user"); 
    	},

    	editInfo : function (objectToEdit){
          return $http.post("/api/v1/user", objectToEdit); 
    	},

      getCityData : function(city){
          return $http.get("/api/v1/city/"+city); 
      },

      searchQuery : function(qry){
          return $http.get("/api/v1/request/"+qry); 
      }, 

		  logout : function(){
			  return $http.get("/api/v1/user/logout");
		  },

      checkIfLoggedIn : function (){
          return $http.get("/api/v1/user"); 
      },

      queryList : [
        "Accounting", "Airport", "Amusement Park", "Aquarium", "Art Gallery", "ATM", "Bakery", "Bank", "Bar", "Beauty Salon", "Bicycle Store", "Book Store", "Bowling Alley", "Bus Station", "Cafe", "Campground", "Car Dealer", "Car Rental", "Car Repair", "Car Wash", "Casino", "Cemetery",
        "Church", "City Hall", "Clothing Store", "Convenience Store", "Couthouse", "Dentist", "Department Store", "Doctor", "Electrician", "Electronics Store", "Embassy", "Establishment", "Finance", "Fire Station", "Florist",  "Food",
        "Funeral Home", "Furniture Store", "Gas Station", "General Contractor", "Grocery or Supermarket", "Gym", "Hair Care", "Hardware Store", "Health", "Hindu Temple", "Home Goods Store", "Hospital", "Insurance Agency", "Jewelry Store", "Laundry", "Lawyer", "Library", "Liquor Store", "Local Government Office", "Locksmith",
        "Lodging", "Meal Delivery", "Meal Takeaway", "Mosque", "Movie Rental", "Movie Theater", "Moving Company", "Museum", "Night Club", "Painter", "Park", "Parking", "Pet Store", "Pharmacy", "Physiotherapist", "Place Of Worship", "Plumber", "Police", "Post Office",
        "Real Estate Agency", "Restaurant", "Roofing Contractor", "RV Park", "School", "Shoe Store", "Shopping Mall", "Mall", "Stadium", "Storage", "Store", "Subway Station", "Synagogue", "Taxi Stand",
        "Train Station", "Travel Agency", "University", "Veterinary care", "Zoos"
      ],

      chartObj : {
      bindto : '#dateGraph',
      axis : {
        x : {
          type:"timeseries",
          tick: {
            format:"%d/%m/%y"
          },
          label: "Date"    
        },
        y : {
          label: {
            text :"#Requests",
            position : "outer-middle"
          }
        }
      },
      grid :{
        x: {
          show : true
        },
        y :{
          show : true
        }
      },
      size :{
        width:900
      },
      data : {

        keys : {
          x : 'timestamp',
          value : ['requests']
        }
      },
      //for our legend
      legend : {
        position : "right",
        inset: {
          anchor: 'top-left',
          x: 20,
          y: 10,
          step: 3
        }
      },
      //enable zoom
      zoom : {
        enabled : true,
        rescale : true
      }
    }

               	
	}
    
}]);
