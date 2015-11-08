//=============
// query Page
//=============

CMDBappControllers.controller('queryCtrl', function($scope, $http, $location, $routeParams, $cookies, $cookieStore, $rootScope){
    $scope.title = "CMDB - Query";
    $scope.heading = "Loading";
    var selectedclass = 'BMC_ComputerSystem';

    $scope.initQuery = function(){
     var req = $http.get("api/utilities/Class")
        .then( function successCallbak(response){
            console.log("Back from Server with success ! > " + response.status);
             // Todo : Create Alert windows if status is not 200
             if (response.status != 200){
                $scope.message = response.status;
             } else {
                $scope.heading = "Success";
                $scope.entries = response.data;                 
             };
        }, function errorCallback(err){
             console.log("Something goes wrong with in the login process..." + err.data);
             $scope.message = "Error : " + err.data.message.code + " - ";
        });  

    };

    $scope.submitCI = function(){
        console.log("submit button");
        $location.path('/cmdb').search({class: selectedclass});
    };

    $scope.update = function(){
        console.log("select change : selection is " + $scope.class.values['Class Name']);
        selectedclass = $scope.class.values['Class Name'];
    };

    $scope.Logout = function(){
        console.log("Logout");
        var req = $http.post("api/logout")
            .success(function(response){
                if (response.status != 204){

                } else {
                    $rootScope.loggedInUser = null;
                    console.log("Disconnected");                   
                    $location.path('/login');
                }

            })
            .error(function(err){
                console/log("Something goes wrong with the logout process... "+ err.data);
            })
    };



// Clear the graph datastore

    ds_nodes.clear();
    ds_edges.clear();

    nodesClassList.splice(0,nodesClassList.length);
    edgesClassList.splice(0,edgesClassList.length);
    CIObjects.splice(0,CIObjects.length);

// Get Default values

    if ($cookies.get('namespace')){
        $scope.namespace = $cookies.get('namespace');
    } else {
        $scope.namespace = "BMC.CORE";
        $cookies.put('namespace' , $scope.namespace);
    };

    if ($cookies.get('dataset')){
        $scope.dataset = $cookies.get('dataset');
    } else {
        $scope.dataset = "BMC.ASSET";
        $cookies.put('dataset' , $scope.dataset);
    };

    if ($cookies.get('rel')){
        $scope.rel = $cookies.get('rel');
    } else {
        $scope.rel = "2";
        $cookies.put('rel' , $scope.rel);
    };

    if ($cookies.get('cl')){
        $scope.cl = $cookies.get('cl');
    } else {
        $scope.cl = "2";
        $cookies.put('cl' , $scope.cl);
    };

    if ($cookies.get('level')){
        $scope.level = $cookies.get('level');
    } else {
        $scope.level = "3";
        $cookies.put('level' , $scope.level);
    }; 

    if ($cookies.get('statemaxrel')){
        $scope.statemaxrel = $cookies.get('statemaxrel');
    } else {
        $scope.statemaxrel = false;
        $cookies.put('statemaxrel' , $scope.statemaxrel);
    }; 

    if ($cookies.get('maxrel')){
        $scope.maxrel = parseInt($cookies.get('maxrel'));
    } else {
        $scope.maxrel = 200;
        $cookies.put('maxrel' , $scope.maxrel);
    }; 


//========================================================
// following code is used to get the ClassName List
//---------------------------------------------------------
    console.log("Query Controller");


     // var req = $http.get("api/utilities/Class")
     //    .then( function successCallbak(response){
     //        console.log("Back from Server with success ! > " + response.status);
     //         // Todo : Create Alert windows if status is not 200
     //         if (response.status != 200){
     //            $scope.message = response.status;
     //         } else {
     //            $scope.heading = "Success";
     //            $scope.entries = response.data;                 
     //         };
     //    }, function errorCallback(err){
     //         console.log("Something goes wrong with in the login process..." + err.data);
     //         $scope.message = "Error : " + err.data.message.code + " - ";
     //    });

});
