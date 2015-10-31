/**
 * Created by tsoulie on 09/10/2015.
 */

// Global in the App

var ds_nodes = new vis.DataSet();
var ds_edges = new vis.DataSet();

var dv_nodes = new vis.DataView(ds_nodes, {
     filter: function (item) {
             return(isInFilterClass(nodesClassList, item.group))
         }
     });
var dv_edges = new vis.DataView(ds_edges, {
     filter: function (item) {
             return(isInFilterClass(edgesClassList, item.title))
//			return(true);
     	}
	 });

var nodesClassList = new Array();
var edgesClassList = new Array();