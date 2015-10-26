// /**
//  * Created by tsoulie on 06/10/2015.
//  */
// var querystring = require('querystring');
// var https = require('https');

// module.exports = function RestCall(option,data,next) {

//     // ToDo : Add Error handler


//     var post_data = querystring.stringify(data);

//     // Set up the request
//     var response = "";
//     var post_req = https.request(option, function (res) {
//         console.log("statusCode: ", res.statusCode);
//         console.log("headers: ", res.headers);
//         res.setEncoding('utf8');
//         res.on('data', function (chunk) {
//             response += chunk;
//             if (res.statusCode == 200){
//                 next(res.statusCode,response);
//             }
//             else {
//                 next(res.statusCode, res.headers);
//             }

//         });
//     });

//     // post the data
//     post_req.write(post_data);
//     post_req.end();

//     post_req.on('error', function(e) {
//         console.error(e);
//     });

// };