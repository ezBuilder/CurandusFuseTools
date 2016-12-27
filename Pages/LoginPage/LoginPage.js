		var Observable = require("FuseJS/Observable");

		var register = Observable();
		var firstName = Observable();
		var phone = Observable();
		var lastName = Observable();

		function registerFunc() {

		    //Replace this when sms-service is defined
		    //var aCode = Math.floor(Math.random() * 900000) + 100000;

		    register = {
		        "firstName": firstName.value,
		        "lastName": lastName.value,
		        "phone": phone.value,
		        "deviceId": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
		        "activationCode": 111111,
		        "status": 0
		    }

		    fetch("http://192.168.1.165:8081/curandusproject/webapi/api/insertprovider", {
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
		        //Da se isprati sms, potoa na success da se prenasoci
		        router.push("ActivationPage", {
		            register: register
		        });

		    }).catch(function(err) {
		        console.log("Error", err.message);

		    });

		}

		module.exports = {
		    register: register,
		    firstName: firstName,
		    phone: phone,
		    lastName: lastName,
		    registerFunc: registerFunc
		};