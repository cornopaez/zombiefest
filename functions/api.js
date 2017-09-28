const request = require('request')

module.exports = {
  apiLogin: apiLogin
};

function apiLogin () {
	return new Promise(function (resolve, reject) {

		var options = { 
			method: 'POST',
			url: 'https://nginx0.pncapix.com/Security/v2.0.0/login',
			headers: 
				{ 'postman-token': '7800cea6-9bfb-7468-1c34-1fa8661b2fcd',
				'cache-control': 'no-cache',
				authorization: 'Bearer f4600098-8aa0-3c3e-8a80-1b983e879753',
				accept: 'application/json',
				'content-type': 'application/json' },
			body: '{"password": "mayduncan206", "username": "mayduncan206"}' 
		};

		request(options, function (error, response, body) {
		  if (error) reject(error);

		  resolve(body);  
		});

	});
}

function customerInfo(token) {
	return new Promise(function(resolve, reject){
		var options = { 
			method: 'GET',
			url: 'https://nginx0.pncapix.com/Customers/v2.0.0/party/profile',
			headers: 
				{ 'postman-token': '6d3fe996-011a-e0dc-a261-b335f465aaf9',
				'cache-control': 'no-cache',
			authorization: 'Bearer f4600098-8aa0-3c3e-8a80-1b983e879753',
			'x-authorization': token,
			accept: 'application/json' } };

		request(options, function (error, response, body) {
		  if (error) throw new Error(error);

		  resolve(body);
		});
	})
}