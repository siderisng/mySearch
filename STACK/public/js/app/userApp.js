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
        
        //Redirect when url is unknown
        $urlRouterProvider.otherwise(function($injector, $location){
            //to put code here for later
            return '/';
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
              
            })

            .state('menu.info',{
              url : '/info',
              templateUrl : 'info',
              controller : 'userCtrl'
            })

            //edit info
            .state('edit',{
              url : '/edit',
              templateUrl : 'edit'
            })

        $locationProvider.html5Mode(true);

        
}]);