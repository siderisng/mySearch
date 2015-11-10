/////////////////////////////////////////////////////////////
//////////AUTHORS :   chocof (https://github.com/chocof)/////
//////////File :  public/js/app/userApp.js          /////////
/////////////////////////////////////////////////////////////



/*!
  Basic module for the frontend
*/
var mySearch = angular.module('mySearch', ['ui.bootstrap','ui.router','ngResource','ui-notification']);


mySearch
.config(['$stateProvider', '$urlRouterProvider','$locationProvider', 
  function ($stateProvider,   $urlRouterProvider, $locationProvider) {
        
        //check if user is logged in         
        function isAuth(){
          return (window.localStorage.getItem('auth'))
        
        }

        //Send to user or sponsor profile page when uknown url
        $urlRouterProvider.otherwise(function($injector, $location){
            //if user requests to access documentation let him 
            //else check if he's logged in 
            if (!$location.path()=='/documentation')
              return '/documentation'
            if (isAuth()) //else to profile
              return '/user';
            else 
              return '/';
            
        });

        //don't let in unauthorized users
        $urlRouterProvider.rule(function($injector, $location){
          //if evil guy tries to enter /user/* redirect him
          if ($location.path().substring(0, 5) === '/user')
            if (!isAuth())
              return'/';
        }); 
         
        //Configuration and routing for states
        $stateProvider 
        
            //public login/signup forms
            .state('site',{
              url : '/',
              templateUrl : 'home',
              controller : 'homeCtrl'
            })


            //---------private states---------
            //user profile
            .state('menu',{
              url : '/user',
              templateUrl : 'profile',
              controller : 'userCtrl'
            })

            .state('menu.info',{
              url : '/info',
              templateUrl : 'info'
           
            })

            //edit info
            .state('menu.edit',{
              url : '/edit',
              templateUrl : 'edit'
            })

            //statistics
            .state('menu.stats',{
              url : '/statistics',
              templateUrl : 'statistics'
            })

            //statistics
            .state('menu.maps',{
              url : '/maps',
              templateUrl : 'maps'
            })
        
        $locationProvider.html5Mode(true);

        
}]);