/**
 * Created by tsoulie on 09/10/2015.
 */

// Global in the App

var ds_nodes = new vis.DataSet();
var ds_edges = new vis.DataSet();
var CIObjects = new Array();

var dv_nodes = new vis.DataView(ds_nodes, {
     filter: function (item) {
             return(isInFilterClass(nodesClassList, item.group))
         }
     });
var dv_edges = new vis.DataView(ds_edges, {
     filter: function (item) {
            var FilteredClass = isInFilterClass(edgesClassList, item.title);
            var IsImpactEdge = isInFilterImpact(item.dashes);
             return(FilteredClass && IsImpactEdge);
     	}
	 });

var nodesClassList = new Array();
var edgesClassList = new Array();
var filterImpactOnly = false;


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