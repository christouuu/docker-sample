var fs = require('fs');
var express = require('express');
var https = require('https');
var app = express();

// localhost:443/alexw@northwindtraders.com

var server = https.createServer({
	key: fs.readFileSync('myPrivateKey.key'),
	cert: fs.readFileSync('myCert.pem')
}, app);
server.listen(443, function() {
	var host = server.address().address;
	var port = server.address().port;
	console.log("GetDynamicsCustomerData app listening at http://%s:%s", host, port);
});


app.get('/:email', function (req, res) {
	var jsonObject = JSON.stringify({"mail": req.params.email});
	console.log(req.params.email + " @ " + (new Date()).toString());
	
   	var options = {
		host: "prod-05.westeurope.logic.azure.com",
		port: 443,
		path: '/workflows/fa2eca08831344a8a52a22477f082446/triggers/manual/run?api-version=2015-08-01-preview&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=pyWl7lrX03OJv6Az01wedEJSMJKGJpKw72nUhSZP5O0',
		method: 'POST',
		headers : {
			'Content-Type' : 'application/json',
			'Content-Length' : Buffer.byteLength(jsonObject, 'utf8')
		}
		
	};
	
	var reqPost = https.request(options, function(resReq) {
		
		// console.log('STATUS: ' + resReq.statusCode);
		// console.log('HEADERS: ' + JSON.stringify(resReq.headers));
		resReq.setEncoding('utf8');
		resReq.on('data', function (chunk) {
			var chunkJson = JSON.parse(chunk);
			if(chunkJson.length > 0) {
				var userData = chunkJson[0];
				res.jsonp(JSON.stringify({
					statusCode : 1,
					firstName : userData.firstname, 
					lastName : userData.lastname,
					email : userData.emailaddress1,
					jobTitle : userData.jobtitle,
					fb : userData.int_facebook,
					twitter : userData.int_twitter, 
					phone : userData.telephone1					
				}));
			}
			else {
				res.jsonp(JSON.stringify({
					statusCode : 0
				}));
			}
		});
	})
	
	reqPost.write(jsonObject);
	reqPost.end();
	
})
