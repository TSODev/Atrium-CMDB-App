//=============
// details Page
//=============

CMDBappControllers.controller('cidetailsCtrl', function($scope, $http, $location, $routeParams){
    $scope.title = "CMDB - Details";
    $scope.heading = "Loading";

    console.log("Route params :" + JSON.stringify($routeParams));
    var instanceId = $routeParams.Id;

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



//========================================================
// following code is used when page is loading to fill the table
//---------------------------------------------------------
    console.log("Details Controller");
     var config = {};

     var req = $http.get("api/details/" + instanceId, config)
         .success(function(response){
            console.log("Back from Server with success ! > " + response.status);
             if (response.status != 200){
                $scope.message = response.status;
             } else {
                $scope.heading = "Success";
                $scope.attributes = response.data;                 
             };
         })
         .error(function(err){
             console.log("Something goes wrong with in the process..." + err.data);
             $scope.message = "Error : " + err.data.message.code + " - ";
         });

});
