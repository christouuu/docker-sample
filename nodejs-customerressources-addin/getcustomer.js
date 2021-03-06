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
	console.log("GetDynamicsCustomerData %s app listening at http://%s:%s", "1.0", host, port);
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/:email', function (req, res) {
	var jsonObject = JSON.stringify({"mail": req.params.email});
	console.log(req.params.email + " @ " + (new Date()).toString());
	
   	var options = {
		host: "prod-00.westeurope.logic.azure.com",
		port: 443,
		path: '/workflows/202c50eb466946eca6dda90b0d33a47b/triggers/manual/run?api-version=2015-08-01-preview&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=vpnW_Co_809vZezTJxRNXd1pwWTX8ZpVYEVPw4_kJSs',
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
		var allResponseData = '';
		resReq.on('data', function (chunk) {
			allResponseData += chunk;
		});
		resReq.on('end', function() {

			var chunkJson = JSON.parse(allResponseData);

			if(chunkJson.salesforceContact) {
				var userData = chunkJson.salesforceContact;
				var companyData = chunkJson.salesforceAccount;
				var userDocs = chunkJson.sharepoint;
				res.jsonp({
					statusCode : 1,
					firstName : userData.FirstName, 
					lastName : userData.LastName,
					email : userData.Email,
					jobTitle : userData.Title,
					Address : userData.MailingStreet + ", " + userData.MailingPostalCode + " " + userData.MailingCity,
					phone : userData.Phone, 
					companyName : companyData.Name, 
					companyWebsite : companyData.Website, 
					relatedDocs : userDocs
				});
			}
			else {
				res.jsonp({
					statusCode : 0
				});
			}
		});
	})
	
	reqPost.write(jsonObject);
	reqPost.end();
	
})
