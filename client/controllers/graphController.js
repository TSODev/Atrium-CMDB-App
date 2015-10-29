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
//      $("#mynetwork").fit();
    };

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
                produceVis($scope.relations, function(network){

        // ToDo : Create Event Handler to manage end of graphing and update the Header...
                  if (!graphloaded){
                    graphloaded = true;
                    $scope.heading = "Success";
                  };

                });

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

var produceVis = function(relationsList, next){

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

    var nodes = [];
    var edges = [];


    for (var i = 0; i < uniqCI.length; i++) {
        nodes.push({
            id: uniqCI[i].text,
            label: uniqCI[i].name,
            group: uniqCI[i].classname,                  // Group By Class Name
            title: uniqCI[i].classname + " : " + uniqCI[i].name
        });
//        console.log("Node - " + i + " : " + JSON.stringify(nodes[i]));
    };

    for (var i = 0; i < relationsList.length; i++) {
        edges.push({
            from: relationsList[i]['Source.InstanceId'],
            to: relationsList[i]['Destination.InstanceId'],
            dashes : (relationsList[i].HasImpact === 5),
            title: relationsList[i].ClassId
        })
    }i


  // create a network
  var container = document.getElementById('mynetwork');
  var configurator = document.getElementById('configurator');
  var data= {
    nodes: nodes,
    edges: edges,
  };


  
  var network = new vis.Network(container, data, options);  
  next(network);

//=======================================================================
// Network Event Manager
//=======================================================================

// network.on('afterDrawing', function(properties) {
// //    next(network);
// });


// network.on( 'click', function(properties) {
//     alert('clicked node ' + properties.nodes);
// });

// network.on( 'dragEnd', function(properties) {
//     alert('Drag End ' + JSON.stringify(network.getViewPosition()));
// });


};









    var getrelations = function(myarray){

        //ToDo - Need to include the injected object attributes for Source and Destination in CSV
        //
            ciarray = myarray;
         return(ciarray);
    };


//});
