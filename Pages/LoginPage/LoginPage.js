		var Observable = require("FuseJS/Observable");
		var activeUrl = require("Constants/SERVICE_URL.js");
		var Device = require('Device');
		var QConfig = require('Scripts/quickbloxConfig.js');

		var register = Observable();
		var firstName = Observable();
		var phone = Observable();
		var lastName = Observable();

		var chatUserId = "";

		var sessionObj = {};

		function createSession() {

		    var data = {
		        'application_id': QConfig.appId,
		        'auth_key': QConfig.authKey,
		        'nonce': Math.floor(Math.random() * 1000),
		        'timestamp': new Date().getTime() / 1000
		    }

		    var signData = QConfig.getSignedData(data);

		    console.log(JSON.stringify(signData));

		    fetch('https://api.quickblox.com/session.json', {
		            method: 'POST',
		            headers: {
		                'Content-Type': 'application/json',
		                'QuickBlox-REST-API-Version': "0.1.0"
		            },
		            body: JSON.stringify(signData)
		        })
		        .then(function(resp) {
		            console.log("Session Created");
		            return resp.json();
		        })
		        .then(function(json) {
		            sessionObj = json.session;

		        })
		        .catch(function(err) {
		            console.log('Error');
		            console.log(JSON.stringify(err));
		        });
		}

		createSession();

		function signUp() {

		    var rnd = Math.floor(Math.random() * 1000);

		    var data = {
		        "user": {
		            "login": phone.value,
		            "password": QConfig.password,
		            "email": phone.value + "@curandus.com",
		            "full_name": firstName.value + " " + lastName.value,
		            "phone": phone.value,
		        }
		    }

		    fetch('http://api.quickblox.com/users.json', {
		            method: 'POST',
		            headers: {
		                'Content-Type': "application/json,",
		                'QuickBlox-REST-API-Version': "0.1.0",
		                'QB-Token': sessionObj.token
		            },
		            body: JSON.stringify(data)
		        })
		        .then(function(resp) {
		            console.log("User Created");
		            return resp.json();
		        })
		        .then(function(json) {
		            chatUserId = json.user.id;

		            registerFunc();


		        })
		        .catch(function(err) {
		            console.log('Error');
		            console.log(JSON.stringify(err));
		        });
		}



		function registerFunc() {

		    //Replace this when sms-service is defined
		    //var aCode = Math.floor(Math.random() * 900000) + 100000;
		    var aCode = 111111;

		    register = {
		        "firstName": firstName.value,
		        "lastName": lastName.value,
		        "phone": phone.value,
		        "deviceId": Device.UUID,
		        "chatId": chatUserId,
		        "activationCode": aCode,
		        "status": 0
		    }

		    fetch(activeUrl.URL + "/curandusproject/webapi/api/insertprovider", {
		        method: 'POST',
		        headers: {
		            "Content-type": "application/json"
		        },
		        dataType: 'json',
		        body: JSON.stringify(register)
		    }).then(function(response) {
		        status = response.status; // Get the HTTP status code
		        console.log('status', status);
		        response_ok = response.ok; // Is response.status in the 200-range?
		        return response.json(); // This returns a promise

		    }).then(function(responseObject) {
		        console.log("Success");
		        var text = "The Activation code is: " + aCode;
		        // sendSms(phone.value, text);

		        router.push("ActivationPage", {
		            register: register
		        });

		    }).catch(function(err) {
		        console.log("Error", err.message);
		    });

		}

		function sendSms(phone, text) {
		    fetch(activeUrl.URL + "/curandusproject/webapi/api/sendsms/sendsms/to=" + phone + "&body=" + text, {
		        method: 'POST',
		        headers: {
		            "Content-type": "application/json"
		        },
		        dataType: 'json'
		    }).then(function(response) {
		        return response.json(); // This returns a promise
		    }).then(function(responseObject) {
		        console.log("Success");
		    }).catch(function(err) {
		        console.log("Error", err.message);
		    });
		}

		module.exports = {
		    register: register,
		    firstName: firstName,
		    phone: phone,
		    lastName: lastName,
		    signUp: signUp,
		    registerFunc: registerFunc
		};