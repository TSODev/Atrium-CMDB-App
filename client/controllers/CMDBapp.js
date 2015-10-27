/**
 * Created by tsoulie on 16/10/2015.
 */
var CMDBapp = angular.module('CMDBapp', ['ngRoute', 'CMDBappControllers', 'angular-loading-bar', 'ngSanitize', 'ngCsv']);

CMDBapp.config(['$routeProvider',
    function($routeProvider, $locationProvider) {
        console.log("Working on routes...");
        $routeProvider.
            when('/', {
                templateUrl: '/login',
                controller: 'loginProcess'
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
CMDBappControllers.controller('defaultCtrl', function($scope, $location){
    $scope.title = "";
    console.log("Home Controller");
});


