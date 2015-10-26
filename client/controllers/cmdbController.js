//====================
// cmdb Page
//====================
CMDBappControllers.controller('cmdbCtrl', function($scope, $http, $location, $routeParams){
    $scope.title = $routeParams.class;
    $scope.heading = "Loading";
    console.log('Param : ' + JSON.stringify($routeParams));

    $scope.filteredItems = [];

    $scope.checkedItems = {};

    $scope.Details = function(instanceId){
        $location.path('details/'+instanceId);
    };

    $scope.Graph = function(instanceId){
        $location.path('/graph/' + instanceId);
    };

    $scope.goHome = function(){
        $location.path('/query');
    };

    $scope.ModalDetails = function(instanceId){
     console.log("Looking for details for : " + instanceId);
     $http.get("api/details/" + instanceId)
         .success(function(response){
            console.log("Back from Server with success ! > " + response.status);
             if (response.status != 200){
                $scope.message = response.status;
             } else {
                $scope.attributes = response.data;  

                $scope.modaltitle = valueForKeyInObject(response.data, 'Name'); 
                $scope.showModal = true;               
             };
         })
         .error(function(err){
             console.log("Something goes wrong with in the process..." + err.data);
             $scope.message = "Error : " + err.data.message.code + " - ";
         });

    }

    $scope.ModalExport = function(){ 

        // ToDo : Export Only Filtered Items ; Export Only CheckedItem
        // ToDo : Add Choice in the Modal ( All | Filtered | Checked )  (radiobutton) 


        if ($scope.filteredItems.length > 0){
            console.log("Trying to export : " + $scope.filteredItems);
            $scope.exportmodaltitle = "Export to file";
            $scope.getArray = getci($scope.filteredItems);
            $scope.getHeader = Object.keys( $scope.instances[0].attributes );
            $scope.showModal = true;           
        } else {
            alert("No item selected , please select some rows...")
            $scope.showModal = false;
        }

    }


//========================================================
// following code is used get the object list for the selected class 
//---------------------------------------------------------
    console.log("API Controller");

     $http.get("api/" +$routeParams.class)
         .success(function(response){
            console.log("Back from Server with success ! > " + response.status);
             // Todo : Create Alert windows if status is not 200
             if (response.status != 200){
                $scope.message = response.status;
             } else {
                $scope.heading = "Success";
                $scope.instances = response.data.instances;;  

                $scope.$watch(function () {

                    // ToDo : secure the filtering process - Seems that checkbox is not correctely checked
                    // ToDo : Get Results in Array , so they can be used in the Export function


                     $scope.filteredItems = $scope.$eval("instances | filter:{attributes: {Name: thefilter}}");
                     console.log("FL : " + $scope.filteredItems.length);

                });                
                $scope.footermessage = "";

             };
         })
         .error(function(err){
             console.log("Something goes wrong with in the process..." + err.data);
             $scope.message = "Error : " + err.data.message.code + " - ";
         });

    var valueForKeyInObject = function(data, key){
        for (i = 0 ; i <data.length ; i++){
            if (data[i].key === key){
                return data[i].value;
                break;
            };
        };
        return -1;
    };


    var getci = function(myarray){
         var ciarray = new Array();
         for (i=0 ; i<myarray.length ; i++){
  //           console.log("("+i+")"+ JSON.stringify(myarray[i].attributes));
             ciarray.push(myarray[i].attributes);
         };
         return(ciarray);
    };

    var getkeyname = function(myarray){
        return(myarray[0].key);
    };
});