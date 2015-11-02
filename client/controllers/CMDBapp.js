/**
 * Created by tsoulie on 16/10/2015.
 */
var CMDBapp = angular.module('CMDBapp', ['ngRoute', 'CMDBappControllers', 'angular-loading-bar', 'ngSanitize', 'ngCsv', 'ngCookies']);

CMDBapp.config(['$routeProvider',
    function($routeProvider, $locationProvider) {
        console.log("Working on routes...");
        $routeProvider.
            when('/', {
                templateUrl: '/login',
                controller: 'loginProcess'
            }).
            when('/prefs', {
                 templateUrl: '/partials/prefs',
                 controller: 'defaultCtrl'
             }).
            when('/user/', {
                 templateUrl: '/partials/user',
                 controller: 'defaultCtrl'
             }).
            when('/query', {
                 templateUrl: '/partials/query',
                 controller: 'queryCtrl'
             }).
             when('/cmdb', {
                 templateUrl: '/partials/cmdb',
                 controller: 'cmdbCtrl'
             }).
             when('/login', {
                    templateUrl: '/partials/login',
                    controller: 'loginProcess'
             }).
            when('/details/:Id', {
                templateUrl: '/partials/details',
                controller: 'cidetailsCtrl'
            }).
            when('/graph/:Id', {
                templateUrl: '/partials/graph',
                controller: 'graphCtrl'
            }).
            when('/exportcilist', {
                templateUrl: '/partials/cmdb',
                controller: 'apiCtrl'
            }).
            otherwise({
                redirectTo: '/query'
            });
    }]);
//=========
//
// function to detect if login is required...
//
//---------

CMDBapp.run(function($rootScope, $location) {
    $rootScope.$on( "$routeChangeStart", function(event, next, current) {
        console.log("route change start detected ! ");
        if ($rootScope.loggedInUser == null) {
            // no logged user, redirect to /login
            if ( next.templateUrl === "/partials/login") {
            } else {
                $location.path("/login");
            }
        } else {
            console.log("User already logged");
        };
    });
});


/*======================================================================================================
 *
 * Définition des contrôleurs
 *
 ========================================================================================================*/

var CMDBappControllers = angular.module('CMDBappControllers', []);

//============
// Home Page (index)
//============
CMDBappControllers.controller('defaultCtrl', function($scope, $location, $cookies, $cookieStore){
    $scope.title = "";
    console.log("Home Controller");

    $scope.preftitle = "CMDB App - Preferences";


        $scope.namespace = $cookies.get('namespace');
        $scope.dataset = $cookies.get('dataset');
        $scope.rel = $cookies.get('rel');
        $scope.cl = $cookies.get('cl');
        $scope.level = $cookies.get('level'); 


    $scope.SavePrefs = function(){
        $cookies.put('namespace', $scope.namespace);
        $cookies.put('dataset', $scope.dataset);
        $cookies.put('rel', $scope.rel);
        $cookies.put('cl', $scope.cl);
        $cookies.put('level', $scope.level);  
        console.log("Parameters saved in cookies.")      
    };
                  

});


