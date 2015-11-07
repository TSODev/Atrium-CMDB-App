/**
 * Created by tsoulie on 06/10/2015.
 */

var express = require('express');
var router = express.Router();
var _ = require('underscore');
var superagent = require('superagent');

var logger = require('./utils/logger');

// // route middleware that will happen on every request
// router.use(function(req, res, next) {
//     // log each request to the console
//     console.log("Router Middleware : " + req.method, req.url);
//     // continue doing what we were doing and go to the route
//     next();
// });

//====================================================
// Utility : Make the APICall
//====================================================

var CallAPI = function(url,next){

    logger.info("Call Api with : " + url);
    superagent.get(url)
        .type('application/json')
        .timeout(5000)                                                // 10s timeout
        .set('Authorization', 'AR-JWT ' + arjwt)
        .end(function(e,response){
                next(e,response);
            }); 
};

//====================================================
// Utility : Make a API call for specific fields for an InstanceId
//====================================================
var publishdata = function(req, res, data){
    res.send(data);
    res.status(data.status);
    res.end();
};


var askforfield = function(req, index, InstanceId, fields, next){

    logger.debug("Ask for Fields : " + InstanceId + " - " + fields);
    var info = new Object();
    var arjwt = req.session.jwt;
    var servername = req.session.servername;
    var port = req.session.portnumber;
    var path = "/api/cmdb/v1/instance/"+req.cookies.dataset+"/"+req.cookies.namespace+"/BMC_BaseElement/" + InstanceId;
    var addurl = '?fields=';
    _.each(fields, function(f){
        addurl += f+',';
    })
    addurl = addurl.slice(0, -1);                                    // remove latest ','
    var url = "https://"+servername+":"+port+path+addurl;


    superagent.get(url)
        .type('application/json')
        .set('Authorization', 'AR-JWT ' + arjwt)
        .end(function(e,response){  
            if (e == null){
                status = response.status;
                if (status == 200){
                    logger.log('debug',"Results : "+response.text);
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

var getgraph = function(req, InstanceId, level, next){

    logger.debug('Get graph info for : ' + InstanceId);

    var arjwt = req.session.jwt;
    var servername = req.session.servername;
    var port = req.session.port;

    var path = "/api/cmdb/v1/instance/"+req.cookies.dataset+"/"+req.cookies.namespace+"/BMC_BaseElement/";
    var url = "https://"+servername+":"+port+path + InstanceId + 
                "/graph?rel=(BMC_BaseRelationship,BMC.CORE,"+ req.cookies.rel + ")" +
                "&cl=(BMC_BaseElement,BMC.CORE)"+
                "&mode="+ req.cookies.cl +
                "&level=" + level;

    var relations = new Array();

    superagent.get(url)
        .type('application/json')
        .timeout(10000)                                                // 10s timeout
        .set('Authorization', 'AR-JWT ' + arjwt)
        .end(function(e,response){
            if (e == null){
                status = response.status;
                if (status == 200){

                    var data = JSON.parse(response.text); 
                    var relationList = data.relationList; 
                    var instances = relationList.instances;             //ToDo Check nb of relation and decrease level if too high

                    var nbrel = instances.length;

                    logger.debug("Number of relations in graph : " + nbrel);

                    if ( nbrel > 200 ){
                        getgraph(req, InstanceId, level-1, next);
                    } else {
                         for (index=0 ; index < nbrel; index++){
                            if ( index == nbrel){ console.log("Why are you coming here ???")};
                            var r = instances[index].attributes;                 
                                relations.push(r);
                            };
                        next(status, relations);                       
                    }



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


    var path = "/api/cmdb/v1/instance/"+req.cookies.dataset+"/"+req.cookies.namespace+"/";
    var host = req.session.servername;
        port = req.session.portnumber;

    var url = "https://"+host+":"+port+path+req.params.ClassId;

    superagent.get(url)
        .type('application/json')
        .set('Authorization', 'AR-JWT ' + arjwt)
        .end(function(e,response){
            if (e == null){
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
    logger.debug("Get details for : " + Id);

    var arjwt = req.session.jwt;
    var servername = req.session.servername;
    var port = req.session.port;

    var data = {};

    var option = {
        path: "/api/cmdb/v1/instance/"+req.cookies.dataset+"/"+req.cookies.namespace+"/BMC_BaseElement/",
        dataset: req.cookies.dataset,
        namespace: req.cookies.namespace,
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


    superagent.get(url)
        .type('application/json')
        .set('Authorization', 'AR-JWT ' + arjwt)
        .end(function(e,response){
            if (e == null){
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
     var level = req.cookies.level;

     if(Id == null){
        publishdata(req, res , {
                                    status: 500,
                                    data: null
        });
     }

     var relations = getgraph(req, Id, level, function(status, data){
        if (status == 200) {

            // Need to Inject some details about Source and Destination
            var requested_fields = ['InstanceId', 'Name', 'ClassId', 'Source.ClassId', 'Destination.ClassId']; 

            var call_counter = 0;

            for (i = 0 ; i < data.length ; i++){
                rel = data[i];
                askforfield(req, i, rel['Source.InstanceId'], requested_fields, function(status, index, fields){
                    if (status == 200){
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
// api/user/:Id : Serving User details
//===============================================
router.get('/user/:Id', function (req, res, next) {
    var Id = req.params.Id;
    logger.debug("Get User info for : " + Id);

    var arjwt = req.session.jwt;
    var servername = req.session.servername;
    var port = req.session.port;

    var data = {};

    var option = {
        path: "/api/arsys/v1/entry/User?q='Login Name'="+'"'+Id+'"',
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

    var url = "https://"+option.host+":"+option.port+option.path;

    var details = []

    superagent.get(url)
        .type('application/json')
        .set('Authorization', 'AR-JWT ' + arjwt)
        .end(function(e,response){
            if (e == null){
                status = response.status;
                if (status == 200){
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
// api/login : Serving login request from Client
//===============================================
router.get('/login', function(req, res, next){
    console.log("GET API-Login");
   next();
});

router.post('/login', function(req, res) {
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

    superagent.post(url)
        .type('application/x-www-form-urlencoded')
        .send({username: data.username, password: data.password})
        .end(function(e,response){
            if (e == null){
                status = response.status;
                if (status == 200){
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
// api/logout : Serving logout request from Client
//===============================================
router.get('/logout', function(req, res, next){
    console.log("GET API-Logout");
   next();
});

router.post('/logout', function(req, res) {
    var arjwt = req.session.jwt;
    var data = {
        username: req.body.username,
        password: req.body.password
    };

    var option = {
        path: "/api/jwt/logout",
        host: req.session.servername,
        port: req.session.port,
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': "AR-JWT " + arjwt
        }
    };
    req.session.servername = option.host;
    req.session.port = option.port;

    var url = "https://"+option.host+":"+option.port+option.path;

    logger.debug('Logout POST on :' + url);

    superagent.post(url)
        .type('application/x-www-form-urlencoded')
        .set('Authorization', 'AR-JWT ' + arjwt)
        .end(function(e,response){
            if (e == null){
                status = response.status;
                if (status == 204){
                    req.session.jwt = null;
                    req.session.servername = null;
                    req.session.portnumber = null;
                    res.send({
                        status : 204,
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
// api/utilities/Dataset : Serving Dataset Get Info
//===============================================
router.get('/utilities/DataSet', function (req, res, next) {
    var Id = req.params.Id;

    var arjwt = req.session.jwt;
    var servername = req.session.servername;
    var port = req.session.port;

    var data = {};

    var option = {
        path: "/api/arsys/v1/entry/BMC.CORE.CONFIG:BMC_Dataset",
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

    var url = "https://"+option.host+":"+option.port+option.path;

    var details = []

    superagent.get(url)
        .type('application/json')
        .set('Authorization', 'AR-JWT ' + arjwt)
        .end(function(e,response){
            if (e == null){
                status = response.status;
                if (status == 200){
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
// api/utilities/list : Serving UTILITIES
//==================================================================================
var getObject = function(req, ObjectId, next){


    var arjwt = req.session.jwt;
    var servername = req.session.servername
    var port = req.session.port;

    var path = "/api/arsys/v1/entry/OBJSTR:" + ObjectId;

    var url = "https://"+servername+":"+port+path;

    superagent.get(url)
        .type('application/json')
        .timeout(10000)                                                // 10s timeout
        .set('Authorization', 'AR-JWT ' + arjwt)
        .end(function(e,response){
            if (e == null){
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

    getObject(req, "Class?q='Class Type'="+'"Class"'+"AND'Abstract'="+'"No"', function(status, data){
            res.send(data.entries);
            res.status(status);
            res.end();       
    });
});


module.exports = router;
