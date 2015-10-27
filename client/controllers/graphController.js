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
                $scope.heading = "Success";

                $scope.relations = response.data; 

                $scope.$watch(function () {

                     $scope.filteredItems = $scope.$eval("relations | filter:{attributes: thefilter}");
//                     console.log("FL : " + $scope.filteredItems.length);
                });                
                produceVis($scope.relations);

                $scope.footermessage = "";

             };
        }, function errorCallback(err){
             console.log("Something goes wrong with in the login process..." + err.data);
             $scope.message = "Error : " + err.data.message.code + " - ";
        });
});

var produceVis = function(relationsList){

/*=====================================
* use to produce vis
=====================================*/

    var CIObjects = new Array();

    for (var i = 0; i < relationsList.length; i++) {
        CIObjects.push({
            text: relationsList[i]['Source.InstanceId'],
            name: relationsList[i].SourceInfo.Name,
            classname: relationsList[i].SourceInfo.ClassId
        });
        CIObjects.push({
            text: relationsList[i]['Destination.InstanceId'],
            name: relationsList[i].DestinationInfo.Name,
            classname: relationsList[i].DestinationInfo.ClassId
        })
    };

    var uniqCI = _.filter(CIObjects, function (element, index) {
        // tests if the element has a duplicate in the rest of the array
        for(index += 1; index < CIObjects.length; index += 1) {
            if (_.isEqual(element, CIObjects[index])) {
                return false;
            }
    }
        return true;
    });


    // for (var i = 0; i < uniqCI.length; i++) {
    //     console.log("Unique = " + i + " : " + JSON.stringify(uniqCI[i]));
    // };

    var nodes = [];
    var edges = [];


    for (var i = 0; i < uniqCI.length; i++) {
        nodes.push({
            id: uniqCI[i].text,
            label: uniqCI[i].name,
            group: uniqCI[i].classname                  // Group By Class Name
        });
        console.log("Node - " + i + " : " + JSON.stringify(nodes[i]));
    };

    for (var i = 0; i < relationsList.length; i++) {
        edges.push({
            from: relationsList[i]['Source.InstanceId'],
            to: relationsList[i]['Destination.InstanceId']
        })
    }i


  // create a network
  var container = document.getElementById('mynetwork');
  var configurator = document.getElementById('configurator');
  var data= {
    nodes: nodes,
    edges: edges,
  };
  // var options = {
  //   width: '1000px',
  //   height: '1000px'
  // };

//===========================================================================================
// Network Options
//----------------------
var options = {
  autoResize: true,
  height: '100%',
  width: '100%',
  locale: 'en',
//  locales: locales,
  clickToUse: false,

// ---- CONFIGURE ----

  configure: {
    enabled: false,
    filter: 'nodes,edges',
    container: configurator,
    showButton: true
  },

// ---- EDGES ----

  edges:{
    arrows: {
      to:     {enabled: false, scaleFactor:1},
      middle: {enabled: false, scaleFactor:1},
      from:   {enabled: false, scaleFactor:1}
    },
    color: '#222222',
    font: '12px arial #ff0000',
    scaling:{
      label: true,
    },
    shadow: true,
    smooth: true,
  },

// ---- NODES ----

   nodes:{
    color: '#EEEEEE',
    fixed: false,
    font: '12px arial black',
    scaling: {
      label: true
    },
    shadow: true
  },

// ---- GROUPS ----

  groups:{
    useDefaultGroups: false,
    BMC_ComputerSystem:{
        color:{background: 'blue'},
        borderWidth:3
    }   
  },

// ---- LAYOUT ----

  layout:{
    hierarchical: false
  },

// ---- INTERACTION ----

  interaction:{
    dragNodes:true,
    dragView: true,
    hideEdgesOnDrag: false,
    hideNodesOnDrag: false,
    hover: false,
    hoverConnectedEdges: true,
    keyboard: {
      enabled: false,
      speed: {x: 10, y: 10, zoom: 0.02},
      bindToWindow: true
    },
    multiselect: false,
    navigationButtons: false,
    selectable: true,
    selectConnectedEdges: true,
    tooltipDelay: 300,
    zoomView: true
  },

// ---- MANIPULATION ----

  manipulation: false,

// ---- PHYSICS ----

  physics:{
    enabled: true,
    barnesHut: {
      gravitationalConstant: -2000,
      centralGravity: 0.3,
      springLength: 95,
      springConstant: 0.04,
      damping: 0.09,
      avoidOverlap: 0
    },
    forceAtlas2Based: {
      gravitationalConstant: -50,
      centralGravity: 0.01,
      springConstant: 0.08,
      springLength: 100,
      damping: 0.4,
      avoidOverlap: 0
    },
    repulsion: {
      centralGravity: 0.2,
      springLength: 200,
      springConstant: 0.05,
      nodeDistance: 100,
      damping: 0.09
    },
    hierarchicalRepulsion: {
      centralGravity: 0.0,
      springLength: 100,
      springConstant: 0.01,
      nodeDistance: 120,
      damping: 0.09
    },
    maxVelocity: 50,
    minVelocity: 0.1,
    solver: 'barnesHut',
    stabilization: {
      enabled: true,
      iterations: 1000,
      updateInterval: 100,
      onlyDynamicEdges: false,
      fit: true
    },
    timestep: 0.5,
    adaptiveTimestep: true
  }
};

  var network = new vis.Network(container, data, options);



};

    var getrelations = function(myarray){

        //ToDo - Need to include the injected object attributes for Source and Destination in CSV
        //
            ciarray = myarray;
         return(ciarray);
    };


//});
