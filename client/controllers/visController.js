//=============
// Vis Page
//=============

CMDBappControllers.controller('visCtrl', function($scope, $http, $location, $routeParams){
    $scope.title = "CMDB - Vis";
    $scope.heading = "Loading";

    console.log("Route params :" + JSON.stringify($routeParams));
    var instanceId = $routeParams.Id;


});
