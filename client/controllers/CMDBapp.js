/**
 * Created by tsoulie on 16/10/2015.
 */
var CMDBapp = angular.module('CMDBapp', ['ngRoute', 'CMDBappControllers', 'angular-loading-bar', 'ngSanitize', 'ngCsv', 'ngCookies', 'ngStorage']);

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
                 controller: 'userCtrl'
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
             when('/logout', {
                    templateUrl: '/partials/logout',
                    controller: 'defaultCtrl'
             }).
             when('/About', {
                    templateUrl: '/partials/about',
                    controller: 'defaultCtrl'
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
        $rootScope.previousPage = location.pathname;
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


// ToDo : Put cookies in security mode (http-only)
// guess that it can be done by options in CookiesProviders

//============
// Home Page (index)
//============
CMDBappControllers.controller('defaultCtrl', function($scope, $http, $location, $cookies, $cookieStore, $rootScope){
    $scope.title = "";
    console.log("Home Controller");

    $scope.preftitle = "CMDB App - Preferences";

    $scope.version = "0.3";
    $scope.build = "145";
    $scope.license = "-tbd-";

//Info : Cookies are set at Home page.

        $scope.namespace = $cookies.get('namespace');
        $scope.dataset = $cookies.get('dataset');
        $scope.rel = $cookies.get('rel');
        $scope.cl = $cookies.get('cl');
        $scope.level = $cookies.get('level'); 
        console.log("CB : "+ $cookies.get('statemaxrel') + ' - ' + $scope.statemaxrel);
        if ($cookies.statemaxrel == true){
            $('.cb').prop('checked', true);
        }else{
            $('.cb').prop('checked', false);
        }
        $scope.maxrel = parseInt($cookies.get('maxrel'));

    $scope.getSystemInfo = function(){
        console.log("Ask for System Info...");
                    
        var req = $http.get("api/utilities/Dataset")
            .success(function(response){
                console.log("Back from Server with success ! > " + response.status + ": " + response.data);
                // Todo : Create Alert windows if status is not 200
                if (response.status != 200){
                    $scope.message = response.data;
                } else {
//                    console.log(response.data.entries);
                    $scope.entries = response.data.entries;                    
                };
            })
            .error(function(err){
                console.log("Something goes wrong with in the login process..." + err.data);
                $scope.message = "Error : " + err.data.message.code + " - ";
            }); 
    };  

    $scope.Update = function(){
    };      

    $scope.SavePrefs = function(){
        console.log("Dataset : "+ JSON.stringify($scope.dataset));
        $cookies.put('namespace', $scope.namespace);
        $cookies.put('dataset',$scope.dataset);
        $cookies.put('rel', $scope.rel);
        $cookies.put('cl', $scope.cl);
        $cookies.put('level', $scope.level);  
        $cookies.put('statemaxrel', $scope.statemaxrel);
        $cookies.put('maxrel', parseInt($scope.maxrel));
        console.log("Parameters saved in cookies."); 
        $location.path('query');     
    };

    $scope.togglemaxrel = function(){
    };

    $scope.QuitAbout = function(){
        $location.path('query');
    }

});


