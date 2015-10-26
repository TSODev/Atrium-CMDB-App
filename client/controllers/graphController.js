//=============
// graph Page
//=============

CMDBappControllers.controller('graphCtrl', function($scope, $http, $location, $routeParams){
    $scope.title = "CMDB - Graph";
    $scope.heading = "Loading";

    console.log("Route params :" + JSON.stringify($routeParams));
    var instanceId = $routeParams.Id;


    $scope.ModalExport = function(){ 

        // ToDo : Export Only Filtered Items ; Export Only CheckedItem
        // ToDo : Add Choice in the Modal ( All | Filtered | Checked )  (radiobutton) 


        if ($scope.filteredItems.length > 0){
            console.log("Trying to export : " + $scope.filteredItems);
            $scope.exportmodaltitle = "Export to file";
            $scope.getArray = getrelations($scope.filteredItems);
            $scope.getHeader = Object.keys( $scope.relations[0]);
            $scope.showModal = true;           
        } else {
            alert("No item selected , please select some rows...")
            $scope.showModal = false;
        }

    }


//========================================================
// following code is used when page is loading to fill the table
//---------------------------------------------------------
    console.log("Graph Controller");
     var config = {};

     $http.get("api/graph/" + instanceId)
        .then( function successCallbak(response){
            console.log("Back from Server with success ! > " + response.status);
             // Todo : Create Alert windows if status is not 200
             if (response.status != 200){
                $scope.message = response.status;
             } else {
                $scope.heading = "Success";

                $scope.relations = response.data; 

                $scope.$watch(function () {

                    // ToDo : secure the filtering process - Seems that checkbox is not correctely checked
                    // ToDo : Get Results in Array , so they can be used in the Export function


                     $scope.filteredItems = $scope.$eval("relations | filter:{attributes: thefilter}");
                     console.log("FL : " + $scope.filteredItems.length);

                });                
                $scope.footermessage = "";

             };
        }, function errorCallback(err){
             console.log("Something goes wrong with in the login process..." + err.data);
             $scope.message = "Error : " + err.data.message.code + " - ";
        });

    var getrelations = function(myarray){

        //ToDo - Need to extract the injected object for Source and Destination

            ciarray = myarray;
         return(ciarray);
    };


});
