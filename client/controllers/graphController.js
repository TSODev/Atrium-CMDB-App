//=============
// graph Page
//=============

CMDBappControllers.controller('graphCtrl', function($scope, $http, $location, $routeParams, $rootScope){
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

    $scope.toggleimpact = function(){
        filterImpactOnly = $scope.impact;
        console.log(filterImpactOnly);
        dv_edges.refresh();
        network.fit();
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

    };

    $scope.initGraph = function(){
        console.log("Graph Controler - Init");

//--Get the RealationList
        getRelationsList($http, instanceId, function(error, relations){
            if (error == null){
                $scope.heading = "Generate Graph";
                $scope.relations = relations;
                $scope.$watch(function(){
                    $scope.filteredItems = $scope.$eval("relations | filter:{attributes: thefilter}");
                });

//-- Create the network for visualization.
                produceVis(relations, function(thenetwork){
                    network = thenetwork;

//-- Manage the network events
                    //=======================================================================
                    // Network Event Manager
                    //=======================================================================


                    var doubleClickTime = 0;
                    var threshold = 200;


// Click and DoubleClick : Check if a second click occurs after the first one on a threshold time

                    network.on('doubleClick', function(properties){
//                        var nodeId = properties.nodes;
//                        console.log("Double Click : " + nodeId.valueOf());
//                        doubleClickTime = new Date();
//                        if (nodeId.length != 0){
//                            GraphAppend(nodeId);
//                        }
                    });


                    network.on('click', function(properties){
                        var t0 = new Date();
                        if (t0 - doubleClickTime > threshold) {
                            setTimeout(function () {
                                if (t0 - doubleClickTime > threshold) {
                                    doOnClick(properties);
                                }
                            },threshold);
                        }
                    });

                    var doOnClick = function(properties) {
                        var nodeId = properties.nodes;
                        if (nodeId.length != 0){
                            console.log('click on Node : ' + nodeId.valueOf());
                            ModalDetails(nodeId.valueOf());       
                        };
                    };


                });                
            } else {
                $scope.heading = 'Error : ' + error.message;
            };

        });
    };



// Would like to add some CI and Relation to the network...
    GraphAppend = function(InstanceId){
        console.log("Append graph with : "+InstanceId);
        getRelationsList($http, InstanceId, function(error, relations){
            if (error == null){
                produceVis(relations, function(thenetwork){

                });
            } else {

            }
        });
    };





});

//*********************************************************************************************************************************************

/*======================================
/ Call API to get relations List
======================================*/

var getRelationsList = function($http, Id, next){
    var req = $http.get("api/graph/"+Id)
        .then( function successCallbak(response){
        console.log("Back from Server with success ! : " + response.status);
            if (response.status != 200){
                next({
                        status: response.status,
                        message: response.data
                });
            } else {
                next(null, response.data);
            }

        }, function errorCallback(err){
            next({
                status: response.status,
                message: err.data
            })
        });
};

/*=====================================
* Produce de Visualtion Network
=====================================*/

var produceVis = function(relationsList,next){

//    var CIObjects = new Array();

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

    ds_nodes.clear();
    ds_edges.clear();

//-- Insert the nodes (should be unique)

    for (var i = 0; i < CIObjects.length; i++) {
            ds_nodes.add({
                id: CIObjects[i].text,
                label: CIObjects[i].name,
                group: CIObjects[i].classname,                                 // Group By Class Name
                title: CIObjects[i].classname + " : " + CIObjects[i].name
            });
    };

//-- insert edges between nodes

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
        edges: dv_edges
      };

  
    var network = new vis.Network(container, data, options); 

    next(network);                                              // Exit and next step...
};


//================== Some other usefull functions =============================================================


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

var isInFilterImpact = function(edges){
    if ( filterImpactOnly ){
        return(!edges);
    } else {
        return(true);
    }       
};

var getrelations = function(myarray){
        //
        //ToDo - Need to include the injected object attributes for Source and Destination in CSV
        //
        ciarray = myarray;
     return(ciarray);
};

