const request = require('request')

module.exports = {
  apiLogin: apiLogin
};

function apiLogin () {
	return new Promise(function (resolve, reject) {

		var options = { method: 'POST',
			url: 'https://nginx0.pncapix.com/Security/v2.0.0/login',
			headers: 
				{ 'postman-token': '7800cea6-9bfb-7468-1c34-1fa8661b2fcd',
				'cache-control': 'no-cache',
				authorization: 'Bearer 8ab230c7-7391-33ee-9d3f-38b1d76fdd80',
				accept: 'application/json',
				'content-type': 'application/json' },
			body: '{ \\ \n   "password": "mayduncan206", \\ \n   "username": "mayduncan206" \\ \n }' };

		request(options, function (error, response, body) {
		  if (error) reject(error);

		  resolve(body);  
		});

	});
}