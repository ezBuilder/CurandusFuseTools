		var Observable = require("FuseJS/Observable");
		// var Modal = require('Modal');

		var user = Observable();
		var status = Observable();
		var patientInfo = Observable();
		var stateCity = Observable();
		var nameLastname = Observable();

		var treatmentItems = Observable();

		fetch("http://89.205.28.221/curandusproject/webapi/api/gettreatmentitemlist/3", {
		    method: 'GET',
		    headers: {
		        "Content-type": "application/json"
		    },
		    dataType: 'json'
		}).then(function(response) {
		    status = response.status; // Get the HTTP status code
		    response_ok = response.ok; // Is response.status in the 200-range?
		    return response.json(); // This returns a promise
		}).then(function(responseObject) {
		    console.log("Success");
		    console.log(JSON.stringify(responseObject));;
		    for (var i = 0; i < responseObject.length; i++) {
		        responseObject[i].render = JSON.parse(responseObject[i].renderingInfo);
		        console.log("render", JSON.stringify(responseObject[i].render));
		        treatmentItems.add(responseObject[i])
		    }

		}).catch(function(err) {
		    console.log("Error", err.message);

		});

		function statusFunc(treatmentItemID) {

		    treatmentItemID = 3;

		    status = {
		        "status": "SKIPPED",
		    };

		    fetch("http://89.205.28.221/curandusproject/webapi/api/updatetreatmentitemlist/" + treatmentItemID, {
		        method: 'PUT',
		        headers: {
		            "Content-type": "application/json"
		        },
		        dataType: 'json',
		        body: JSON.stringify(status)
		    }).then(function(response) {
		        status = response.status; // Get the HTTP status code
		        response_ok = response.ok; // Is response.status in the 200-range?
		        return response.json(); // This returns a promise
		    }).then(function(responseObject) {
		        console.log("Success");

		    }).catch(function(err) {
		        console.log("Error", err.message);

		    });
		};

		function skip(item) {
		    // Modal.showModal(
		    //     "Skip " + JSON.stringify(item.data.label),
		    //     "Are you sure you want to skip this item?", ["Yes", "No"],
		    //     function(s) {
		    //         debug_log("Got callback with " + s);
		    //         if (s == "Yes") {
		    //             console.log("Clicked item - " + JSON.stringify(item.data.treatmentItemListId));
		    //             statusFunc(item.data.treatmentItemListId);
		    //         }
		    //     });
		}

		fetch("http://192.168.1.110:8080/curandusproject/webapi/api/getpatientdata/5", {
		    method: 'GET',
		    headers: {
		        "Content-type": "application/json"
		    },
		    dataType: 'json'
		}).then(function(response) {
		    status = response.status; // Get the HTTP status code
		    response_ok = response.ok; // Is response.status in the 200-range?
		    return response.json(); // This returns a promise
		}).then(function(responseObject) {

		    console.log("Success");

		    patientInfo.value = responseObject;


		    console.log(patientInfo.value.StreetAddress);
		    console.log(patientInfo.value.city);



		    stateCity.value = patientInfo.value.city + " /  " + patientInfo.value.state;
		    nameLastname.value = patientInfo.value.firstName + " " + patientInfo.value.lastName;

		    console.log(stateCity);
		    console.log(nameLastname);

		}).catch(function(err) {
		    console.log("Error", err.message);

		});

		this.onParameterChanged(function(param) {
		    console.log("++++++++++++++++++++++++++++++++++++++++" + JSON.stringify(param.user));

		    user.value = JSON.stringify(param.user);
		})

		module.exports = {
		    user: user,
		    statusFunc: statusFunc,
		    patientInfo: patientInfo,
		    stateCity: stateCity,
		    treatmentItems: treatmentItems,
		    nameLastname: nameLastname,
		    skip: skip,
		};