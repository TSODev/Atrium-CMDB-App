//=============
// query Page
//=============

CMDBappControllers.controller('queryCtrl', function($scope, $http, $location, $routeParams){
    $scope.title = "CMDB - Query";
    $scope.heading = "Loading";
    var selectedclass = 'BMC_ComputerSystem';
    $scope.submitCI = function(){
        console.log("submit button");
        $location.path('/cmdb').search({class: selectedclass});

    };

    $scope.update = function(){
        console.log("select change : selection is " + $scope.class.values['Class Name']);
        selectedclass = $scope.class.values['Class Name'];
    };

//========================================================
// following code is used to get the ClassName List
//---------------------------------------------------------
    console.log("Query Controller");


     $http.get("api/utilities/Class")
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

});
