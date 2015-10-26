/**
 * Created by tsoulie on 06/10/2015.
 */

var express = require('express');
var router = express.Router();
var _ = require('underscore');
var superagent = require('superagent');
var sa2 = require('superagent');

// route middleware that will happen on every request
router.use(function(req, res, next) {
    // log each request to the console
    console.log("Router Middleware : " + req.method, req.url);
    // continue doing what we were doing and go to the route
    next();
});

//====================================================
// Utility : Make a API call for specific fields for an InstanceId
//====================================================
var publishdata = function(req, res, data){
    res.send(data);
    res.status(data.status);
    res.end;
};


var askforfield = function(req, index, InstanceId, fields, next){
    var info = new Object();
    var arjwt = req.session.jwt;
    var servername = req.session.servername;
    var port = req.session.portnumber;
    var path = "/api/cmdb/v1/instance/BMC.ASSET/BMC.CORE/BMC_BaseElement/" + InstanceId;
    var addurl = '?fields=';
    _.each(fields, function(f){
        addurl += f+',';
    })
    addurl = addurl.slice(0, -1);                                    // remove latest ','
    var url = "https://"+servername+":"+port+path+addurl;

//    console.log("asking : " + url);

    superagent.get(url)
        .type('application/json')
        .set('Authorization', 'AR-JWT ' + arjwt)
        .end(function(e,response){  
//            console.log("END Event !");          
            if (e == null){
                status = response.status;
                if (status == 200){
                    next(status, index, JSON.parse(response.text));                 
                } else {
                    console.log("Error : Request status : "+ status);
                    next(500, index,  null);
                }
            }
            else {
                console.log("Cannot complete the request - " + e );
                next(e.status, index,  e);
            };
        });
}

var getgraph = function(req, InstanceId, next){

//    console.log("I now arrive in graph call... , Id is " + InstanceId);

    var arjwt = req.session.jwt;
    var servername = req.session.servername;
    var port = req.session.port;

    var path = "/api/cmdb/v1/instance/BMC.ASSET/BMC.CORE/BMC_BaseElement/";
    var url = "https://"+servername+":"+port+path + InstanceId + "/graph?rel=(BMC_BaseRelationship,BMC.CORE,2)&cl=(BMC_BaseElement,BMC.CORE)&mode=2&level=10";

    var relations = new Array();

//    console.log("asking : " + url);

    superagent.get(url)
        .type('application/json')
        .timeout(10000)                                                // 10s timeout
        .set('Authorization', 'AR-JWT ' + arjwt)
        .end(function(e,response){
//            console.log("response : " + response + " Error : " + e);
            if (e == null){
//                console.log("get from superagent : ");
                status = response.status;
                if (status == 200){

                    var data = JSON.parse(response.text); 
                    var relationList = data.relationList; 
                    var instances = relationList.instances;

                    var nbrel = instances.length;
                    for (index=0 ; index < nbrel; index++){
                        if ( index == nbrel){ console.log("Why are you coming here ???")};
                        var r = instances[index].attributes;                 
                            relations.push(r);
                    };

                    next(status, relations);

                } else {
                    next(status, response);
                 }
            }
            else {
                next(e.status, e);
            };
        }); 

}

//=====================================================
// GET home page.   /api with ClassName - return with Array of Objects
//=====================================================
router.get('/:ClassId', function(req, res, next) {

    var arjwt = req.session.jwt;

//    console.log("Using session token : " + arjwt);

    var path = "/api/cmdb/v1/instance/BMC.ASSET/BMC.CORE/";
//        path: "/api/cmdb/v1/instance/BMC.ASSET/BMC.CORE/BMC_BaseElement";
    var host = req.session.servername;
        port = req.session.portnumber;

    var url = "https://"+host+":"+port+path+req.params.ClassId;

//    console.log("asking : " + url);

    superagent.get(url)
        .type('application/json')
        .set('Authorization', 'AR-JWT ' + arjwt)
        .end(function(e,response){
//            console.log("response : " + response + " Error : " + e);
            if (e == null){
//                console.log("get from superagent : " + JSON.stringify(response.text));
//                console.log("get from superagent : ");
                status = response.status;
                if (status == 200){
         // parsed response body as js object
                var data = JSON.parse(response.text);                  
                    res.send({
                        status : 200,
                        data : data
                    });
                    res.status(status);
                    res.end();
                } else {
                    console.log("Error : Request status : "+ status);
                    res.send({
                        status : status,
                        data : response
                    });
                    res.status(status);
                    res.end();
                }
            }
            else {
                console.log("Cannot complete the request - " + e );
                res.send({
                    status: 500,
                    data: e
                });
                res.status(500);
                res.end();
            };
        });
});

//====================================================================================================================
// api/InstanceId : Serving InstanceId details
//===============================================
router.get('/details/:Id', function (req, res, next) {
    var Id = req.params.Id;

    var arjwt = req.session.jwt;
    var servername = req.session.servername;
    var port = req.session.port;

    var data = {};

    var option = {
        path: "/api/cmdb/v1/instance/BMC.ASSET/BMC.CORE/BMC_BaseElement/",
        dataset: "BMC.ASSET",
        namespace: "BMC.CORE",
        classname: "BMC_ComputerSystem",
        host: servername,
        port: port,
        method: "GET"
    };

    var args = {
        headers: {
            'Content-Type': "application/json",
            'Authorization': "AR-JWT " + arjwt
        }
    };

    var url = "https://"+option.host+":"+option.port+option.path + Id;

    var details = []

//    console.log("asking : " + url);

    superagent.get(url)
        .type('application/json')
        .set('Authorization', 'AR-JWT ' + arjwt)
        .end(function(e,response){
//            console.log("response : " + response + " Error : " + e);
            if (e == null){
//                console.log("get from superagent : " + JSON.stringify(response.text));
//                console.log("get from superagent : ");
                status = response.status;
                if (status == 200){
         // parsed response body as js object
                var data = JSON.parse(response.text); 
                var attr = data.attributes;

                 var index = 0;
                 _.each(attr, function (val, key) {

                    if (key === "AttributeDataSourceList"){
                        if (val != null)
                                val = val.replace(/,/g,", ")
                    };

                     details.push({key: key,
                                    value: val});
                     index += 1;
                 });

                    res.send({
                        status : 200,
                        data : details
                    });
                    res.status(status);
                    res.end();
                } else {
                    console.log("Error : Request status : "+ status);
                    res.send({
                        status : status,
                        data : response
                    });
                    res.status(status);
                    res.end();
                }
            }
            else {
                console.log("Cannot complete the request - " + e );
                res.send({
                    status: 500,
                    data: e
                });
                res.status(500);
                res.end();
            };
        });    

});

//====================================================================================================================
// api/graph/InstanceId : Serving InstanceId details
//==================================================================================
router.get('/graph/:Id', function (req, res, next) {

     var Id = req.params.Id;
//     console.log("I am in Graph ! with Id : " + Id);

     var relations = getgraph(req, Id, function(status, data){
        if (status == 200) {

            // Need to Inject some details about Source and Destination 


            var requested_fields = ['InstanceId', 'Name', 'ClassId', 'Source.ClassId', 'Destination.ClassId']; 

            var call_counter = 0;

            for (i = 0 ; i < data.length ; i++){
                rel = data[i];
                askforfield(req, i, rel['Source.InstanceId'], requested_fields, function(status, index, fields){
                    if (status == 200){
//                        console.log("Back from askfordetail with : " + index + " - " + JSON.stringify(fields));
                        data[index].SourceInfo = fields.attributes;
                        call_counter += 1;
                        if (call_counter == (2 * data.length)){
                            publishdata(req, res, data);
                        }
                    }
                    else
                    {
                        console.log("Error calling the askforfield function ...");
                    }
                });
                askforfield(req, i, rel['Destination.InstanceId'], requested_fields, function(status, index,  fields){
                    if (status == 200){
//                        console.log("Back from askfordetail with : " + index + " - " + JSON.stringify(fields));
                        data[index].DestinationInfo = fields.attributes;
                        call_counter += 1;
                        if (call_counter == (2 * data.length)){
                            publishdata(req, res, data);
                        }
                    }
                    else
                    {
                        console.log("Error calling the askforfield function ...");
                    }
                });
            };
        } else {
            console.log("Error in call ? - Error :" + status + " " + data.text);
             res.send({
                 status: status,
                 data: data.text
             });
             res.status(status);
             res.end();
        }

     });

});


//====================================================================================================================
// api/login : Serving login request from Client
//===============================================
router.get('/login', function(req, res, next){
    console.log("GET API-Login");
   next();
});

router.post('/login', function(req, res) {
   console.log("POST : Landing on api/login :");
    var data = {
        username: req.body.username,
        password: req.body.password
    };

    var option = {
        path: "/api/jwt/login",
        host: req.body.servername,
        port: req.body.portnumber,
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    req.session.servername = option.host;
    req.session.port = option.port;

    var url = "https://"+option.host+":"+option.port+option.path;

//    console.log(option.host + ":" + option.port + " with " + data.username + "/" + data.password);
    superagent.post(url)
        .type('application/x-www-form-urlencoded')
        .send({username: data.username, password: data.password})
        .end(function(e,response){
//            console.log("response : " + response + " Error : " + e);
            if (e == null){
//                console.log("get from superagent : " + JSON.stringify(response));
//                console.log("get from superagent : ");
                status = response.status;
                if (status == 200){
//                    console.log("Token : " + response.text);
                    req.session.jwt = response.text;
                    req.session.servername = option.host;
                    req.session.portnumber = option.port;
                    res.send({
                        status : 200,
                        data : response
                    });
                    res.status(status);
                    res.end();
                } else {
                    console.log("Error : Request status : "+ status);
                    //res.json(response);
                    res.send({
                        status : status,
                        data : response
                    });
                    res.status(status);
                    res.end();
                }
            }
            else {
                console.log("Cannot complete the request - " + e );
                res.send({
                    status: 500,
                    data: e
                });
                res.status(500);
                res.end();
            };
        });
});


//====================================================================================================================
// api/utilities/list : Serving UTILITIES
//==================================================================================
var getObject = function(req, ObjectId, next){

//    console.log("I now arrive in getObject call... , Id is " + ObjectId);

    var arjwt = req.session.jwt;
    var servername = req.session.servername
    var port = req.session.port;

    var path = "/api/arsys/v1/entry/OBJSTR:" + ObjectId;

    var url = "https://"+servername+":"+port+path;
//    console.log("asking : " + url);

    superagent.get(url)
        .type('application/json')
        .timeout(10000)                                                // 10s timeout
        .set('Authorization', 'AR-JWT ' + arjwt)
        .end(function(e,response){
//            console.log("response : " + response + " Error : " + e);
            if (e == null){
//                console.log("get from superagent : ");
                status = response.status;
                if (status == 200){
                    var data = JSON.parse(response.text); 
                    next(status, data);
                } else {
                    next(status, response);
                 }
            }
            else {
                next(e.status, e);
            };
        }); 

};

router.get('/utilities/Class', function (req, res, next) {

//    console.log("I am in Utilities ! looking for OBJSTR:Class");

    getObject(req, "Class?q='Class Type'="+'"Class"'+"AND'Abstract'="+'"No"', function(status, data){
            res.send(data.entries);
            res.status(status);
            res.end();       
    });
});


module.exports = router;
