		var Observable = require("FuseJS/Observable");
		var Modal = require('Modal');

		var user = Observable();
		var status = Observable();
		var patientInfo = Observable();
		var stateCity = Observable();
		var nameLastname = Observable();
		var chat = Observable();
		var treatmentItems = Observable();
		var templejt = Observable();
		var firstID = 0;
		var lastID = 0;
		var patientId = "";

		this.onParameterChanged(function(param) {
		    user.value = param.user;

		    patientId = JSON.stringify(user.value.patientId);

		    fetch("http://192.168.1.165:8081/curandusproject/webapi/api/getPatientsData/patientId=" + patientId, {
		        method: 'GET',
		        headers: {
		            "Content-type": "application/json"
		        },
		        dataType: 'json'
		    }).then(function(response) {
		        response_ok = response.ok; // Is response.status in the 200-range?
		        return response.json(); // This returns a promise
		    }).then(function(responseObject) {

		        console.log("Success");
		        console.log(JSON.stringify(responseObject));

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

		    console.log("PARAM", patientId);
		})


		function loadMore() {

		    console.log("LOAD");
		    fetch("http://192.168.1.165:8081/curandusproject/webapi/api/treatmentitemlistscroll/treatmentitemlistid=" + lastID + "&updown=D&range=10", {
		        method: 'GET',
		        headers: {
		            "Content-type": "application/json"
		        },
		        dataType: 'json'
		    }).then(function(response) {
		        response_ok = response.ok; // Is response.status in the 200-range?
		        return response.json(); // This returns a promise
		    }).then(function(responseObject) {
		        console.log("Success");
		        console.log(JSON.stringify(responseObject));

		        lastID = responseObject[responseObject.length - 1].treatmentItemListId;

		        for (var i = 0; i < responseObject.length; i++) {


		            var tmpDate = new Date(responseObject[i].timeScheduled);

		            var days = tmpDate.getDate();
		            var months = tmpDate.getMonth() + 1;
		            var year = tmpDate.getFullYear();
		            var hours = tmpDate.getHours();
		            var min = tmpDate.getMinutes();

		            var fullDate = ('0' + tmpDate.getDate()).slice(-2) + '.' + ('0' + (tmpDate.getMonth() + 1)).slice(-2) + '.' + tmpDate.getFullYear();
		            var fulltime = ('0' + hours).slice(-2) + ':' + ('0' + min).slice(-2);

		            responseObject[i].fullDate = fullDate;
		            responseObject[i].fullTime = fulltime;

		            templejt.add(responseObject[i])
		        }

		    }).catch(function(err) {
		        console.log("Error", err.message);

		    });
		}


		function loadMore1() {

		    console.log("LOAD111111");
		    fetch("http://192.168.1.165:8081/curandusproject/webapi/api/treatmentitemlistscroll/treatmentitemlistid=" + firstID + "&updown=U&range=10", {
		        method: 'GET',
		        headers: {
		            "Content-type": "application/json"
		        },
		        dataType: 'json'
		    }).then(function(response) {
		        response_ok = response.ok; // Is response.status in the 200-range?
		        return response.json(); // This returns a promise
		    }).then(function(responseObject) {
		        console.log("Success");
		        console.log(JSON.stringify(responseObject));;

		        firstID = responseObject[0].treatmentItemListId;

		        for (var i = responseObject.length - 1; i >= 0; i--) {

		            var tmpDate = new Date(responseObject[i].timeScheduled);

		            var days = tmpDate.getDate();
		            var months = tmpDate.getMonth() + 1;
		            var year = tmpDate.getFullYear();
		            var hours = tmpDate.getHours();
		            var min = tmpDate.getMinutes();

		            var fullDate = ('0' + tmpDate.getDate()).slice(-2) + '.' + ('0' + (tmpDate.getMonth() + 1)).slice(-2) + '.' + tmpDate.getFullYear();
		            var fulltime = ('0' + hours).slice(-2) + ':' + ('0' + min).slice(-2);

		            responseObject[i].fullDate = fullDate;
		            responseObject[i].fullTime = fulltime;

		            templejt.insertAt(0, responseObject[i])
		        }


		    }).catch(function(err) {
		        console.log("Error", err.message);

		    });
		}

		function initload() {

		    console.log("LOAD");
		    fetch("http://192.168.1.165:8081/curandusproject/webapi/api/treatmentitemlis/activetreatmentid=15", {
		        method: 'GET',
		        headers: {
		            "Content-type": "application/json"
		        },
		        dataType: 'json'
		    }).then(function(response) {
		        response_ok = response.ok; // Is response.status in the 200-range?
		        return response.json(); // This returns a promise
		    }).then(function(responseObject) {
		        console.log("Success");
		        console.log(JSON.stringify(responseObject));
		        firstID = responseObject[0].treatmentItemListId;
		        lastID = responseObject[responseObject.length - 1].treatmentItemListId;
		        console.log(firstID, lastID);
		        for (var i = 0; i < responseObject.length; i++) {

		            var tmpDate = new Date(responseObject[i].timeScheduled);

		            var days = tmpDate.getDate();
		            var months = tmpDate.getMonth() + 1;
		            var year = tmpDate.getFullYear();
		            var hours = tmpDate.getHours();
		            var min = tmpDate.getMinutes();

		            var fullDate = ('0' + tmpDate.getDate()).slice(-2) + '.' + ('0' + (tmpDate.getMonth() + 1)).slice(-2) + '.' + tmpDate.getFullYear();
		            var fulltime = ('0' + hours).slice(-2) + ':' + ('0' + min).slice(-2);

		            responseObject[i].fullDate = fullDate;
		            responseObject[i].fullTime = fulltime;

		            console.log(fullDate, fulltime);

		            templejt.add(responseObject[i])
		        }



		    }).catch(function(err) {
		        console.log("Error", err.message);

		    });



		}
		initload();

		function statusFunc(e) {

		    console.log(JSON.stringify(e.data));

		    var treatmentItemListId = JSON.stringify(e.data.treatmentItemListId);


		    var data = {
		        "treatmentItemListId": e.data.treatmentItemListId,
		        "treatmentitem": e.data.treatmentitem,
		        "label": e.data.treatmentitem,
		        "timeScheduled": null,
		        "timeDone": e.data.timeDone,
		        "timeRemove": e.data.timeRemove,
		        "status": "SKIPPED",
		        "renderingInfo": null,
		        "responseInfo": e.data.responseInfo,
		        "created": null,
		        "createdBy": e.data.createdBy,
		        "modified": null,
		        "modifiedBy": e.data.modifiedBy
		    };


		    Modal.showModal(
		        "Skip " + JSON.stringify(e.data.label),
		        "Are you sure you want to skip this item?", ["Yes", "No"],
		        function(s) {
		            debug_log("Got callback with " + s);
		            if (s == "Yes") {

		                fetch("http://192.168.1.165:8081/curandusproject/webapi/api/updatetreatmenitemlist/TreatmentItemListId=" + treatmentItemListId, {
		                    method: 'POST',
		                    headers: {
		                        "Content-type": "application/json"
		                    },
		                    dataType: 'json',
		                    body: JSON.stringify(data)
		                }).then(function(response) {
		                    response_ok = response.ok; // Is response.status in the 200-range?
		                    return response.json(); // This returns a promise
		                }).then(function(responseObject) {
		                    console.log("Success EDIT");
		                    console.log(JSON.stringify(responseObject));

		                }).catch(function(err) {
		                    console.log("Error", err.message);

		                });

		            }
		        });


		};

		function skip(item) {
		    Modal.showModal(
		        "Skip " + "TEST",
		        "Are you sure you want to skip this item?", ["Yes", "No"],
		        function(s) {
		            debug_log("Got callback with " + s);
		            if (s == "Yes") {
		                console.log("Clicked item - TEST");
		                // statusFunc(item.data.treatmentItemListId);
		            }
		        });
		}


		function edit() {
		    console.log('edit clicked');
		}

		function end() {
		    console.log('end clicked');
		}

		function goToChat() {
		    router.push("chat", JSON.stringify(user));
		}

		module.exports = {
		    user: user,
		    statusFunc: statusFunc,
		    patientInfo: patientInfo,
		    stateCity: stateCity,
		    treatmentItems: treatmentItems,
		    nameLastname: nameLastname,
		    skip: skip,
		    edit: edit,
		    end: end,
		    goToChat: goToChat,
		    templejt: templejt,
		    loadMore: loadMore,
		    loadMore1: loadMore1,
		};