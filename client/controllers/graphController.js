//=============
// graph Page
//=============

CMDBappControllers.controller('graphCtrl', function($scope, $http, $location, $routeParams){
    $scope.title = "CMDB - Graph";
    $scope.heading = "Loading";

    console.log("Route params :" + JSON.stringify($routeParams));
    var instanceId = $routeParams.Id;


    $scope.GraphIt = function(relationsList){
        $scope.showModal = true;
    }

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

    var cur_width = 0;
    var cur_height = 0;
    var fullscreen = false;

    $scope.togglefullscreen = function() {
//      alert("Toggle : " + fullscreen + " - " + cur_width + "|" + cur_height);
      $('#header').toggle();
      $('#footer').toggle();
      if (!fullscreen){
        fullscreen = true;
        cur_width = $('#mynetwork').width();
        cur_height = $('#mynetwork').height();
        $('#mynetwork').width($(window).width()-50).height($(window).height()-40);        
      } else {
        fullscreen = false;       
        $("#mynetwork").width(cur_width).height(cur_height);
      }

    };

    $scope.fit = function(){
      network.fit();
    };


    $scope.nodesClassList = nodesClassList;
    $scope.edgesClassList = edgesClassList;

    $scope.togglenodesclass = function(){
        dv_nodes.refresh();
        network.fit();
    };

    $scope.toggleedgesclass = function(){
        dv_edges.refresh();
        network.fit();
    };

    ModalDetails = function(instanceId){
     console.log("Looking for details for : " + instanceId);
     var req = $http.get("api/details/" + instanceId)
         .success(function(response){
            console.log("Back from Server with success ! > " + response.status);
             if (response.status != 200){
                $scope.message = response.status;
             } else {
                $scope.attributes = response.data;  

                $scope.modaltitle = valueForKeyInObject(response.data, 'Name'); 
                $('#DetailsModal').modal('show') ;              
             };
         })
         .error(function(err){
             console.log("Something goes wrong with in the process..." + err.data);
             $scope.message = "Error : " + err.data.message.code + " - ";
         });

    }


//========================================================
// following code is used when page is loading to fill the table
//---------------------------------------------------------
    console.log("Graph Controller");
     var config = {};

     var req = $http.get("api/graph/" + instanceId)
        .then( function successCallbak(response){
            console.log("Back from Server with success ! > " + response.status);
             // Todo : Create Alert windows if status is not 200
             if (response.status != 200){
                $scope.message = response.status;
             } else {
                $scope.heading = "Generate Graph";
                $scope.relations = response.data; 
                $scope.$watch(function () {
                     $scope.filteredItems = $scope.$eval("relations | filter:{attributes: thefilter}");
                });  

                var graphloaded = false;
                network = produceVis($scope.relations);

        // ToDo : Create Event Handler to manage end of graphing and update the Header...

                network.fit();

                $scope.footermessage = "";

             };
        }, function errorCallback(err){
             console.log("Something goes wrong with in the login process..." + err.data);
             $scope.message = "Error : " + err.data.message.code + " - ";
        });
});


/*=====================================
* Produce de Visualtion Network
=====================================*/

var produceVis = function(relationsList,next){

    var CIObjects = new Array();

// put ALL CIs involved in the relation List... (duplicate CI in the Array)

    for (var i = 0; i < relationsList.length; i++) {
        if (!findInstanceId(CIObjects, relationsList[i]['Source.InstanceId'])){
            CIObjects.push({
                text: relationsList[i]['Source.InstanceId'],
                name: relationsList[i].SourceInfo.Name,
                classname: relationsList[i].SourceInfo.ClassId
            });
            if (!findClassName(nodesClassList,relationsList[i].SourceInfo.ClassId)){
                nodesClassList.push({
                    name: relationsList[i].SourceInfo.ClassId,
                    selected: true
                });                  
            };          
        };
        if (!findInstanceId(CIObjects, relationsList[i]['Destination.InstanceId'])){
            CIObjects.push({
                text: relationsList[i]['Destination.InstanceId'],
                name: relationsList[i].DestinationInfo.Name,
                classname: relationsList[i].DestinationInfo.ClassId
            });
            if (!findClassName(nodesClassList,relationsList[i].DestinationInfo.ClassId)){
                nodesClassList.push({
                    name: relationsList[i].DestinationInfo.ClassId,
                    selected: true
                });                  
            }; 
        };
    };

//     var uniqCI = CIObjects;

    for (var i = 0; i < CIObjects.length; i++) {
            ds_nodes.add({
                id: CIObjects[i].text,
                label: CIObjects[i].name,
                group: CIObjects[i].classname,                                 // Group By Class Name
                title: CIObjects[i].classname + " : " + CIObjects[i].name
            });
    };


    for (var i = 0; i < relationsList.length; i++) {
        if (!findClassName(edgesClassList, relationsList[i].ClassId)){
            edgesClassList.push({
                name: relationsList[i].ClassId,
                selected: true
            });
        };
        ds_edges.add({
            from: relationsList[i]['Source.InstanceId'],
            to: relationsList[i]['Destination.InstanceId'],
            dashes : (relationsList[i].HasImpact === 5),
            title: relationsList[i].ClassId
        })
    };

  // create a network
  var container = document.getElementById('mynetwork');
  var configurator = document.getElementById('configurator');
  var data= {
    nodes: dv_nodes,
    edges: dv_edges,
  };

  
  var network = new vis.Network(container, data, options); 


//=======================================================================
// Network Event Manager
//=======================================================================

 network.on('afterDrawing', function(properties) {
//    console.log('Drawing done !');
 });



// network.on( 'dragEnd', function(properties) {
//     alert('Drag End ' + JSON.stringify(network.getViewPosition()));
// });


network.on('click', function(properties){
    var nodeId = properties.nodes;
    if (nodeId.length != 0){
        console.log('click on Node : ' + nodeId.valueOf());
        ModalDetails(nodeId.valueOf());       
    };
});


return(network); 
};

    var findInstanceId = function(myarray, value) {
        var result = $.grep(myarray, function(e){ return (e.text == value); });
        return((result.length != 0));
    };

    var findClassName = function(myarray, value) {
        var result = $.grep(myarray, function(e){ return (e.name == value); });
        return((result.length != 0));
    };

    var isInFilterClass = function(myarray, classname){
        var result = $.grep(myarray, function(e) {return (e.name == classname); });
        return(result[0].selected);
    };


    var getrelations = function(myarray){
        //
        //ToDo - Need to include the injected object attributes for Source and Destination in CSV
        //
            ciarray = myarray;
         return(ciarray);
    };


//});
