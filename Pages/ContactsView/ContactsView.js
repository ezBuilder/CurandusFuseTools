var Observable = require("FuseJS/Observable");
var Storage = require("FuseJS/Storage");

var isDoctors = Observable(false);
var data = Observable();
var dataDoctors = Observable();
var letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

var final = [];
var finalDoctors = [];

var isLoadingContacts = Observable(false);
var isLoadingDoctors = Observable(false);

function reloadHandler() {
    isLoadingContacts.value = true;
    fetchData();
}

function reloadHandlerDoctors() {
    isLoadingDoctors.value = true;
    fetchDataDoctors();
}

function endLoadingContacts() {
    isLoadingContacts.value = false;
}

function endLoadingDoctors() {
    isLoadingDoctors.value = false;
}

function setDoctors() {
    isDoctors.value = true;
}

function setPatients() {
    isDoctors.value = false;
}

var userInfo = Storage.readSync("userInfo");

// var providerId = 1;
// var providerId = userInfo.providerId;

function fetchDataDoctors() {
    finalDoctors = [];
    // ТРЕБА ДА СЕ СМЕНИ
    var urlProvider = "http://192.168.1.165:8081/curandusproject/webapi/api/getprovidersdatabyprovider/1"
    console.log(urlProvider);
    fetch(urlProvider, {
        method: 'GET',
        headers: {
            "Content-type": "application/json"
        },
        dataType: 'json'
    }).then(function(response) {
        return response.json(); // This returns a promise
    }).then(function(contacts) {

        var flag = false;

        for (var i = contacts.length - 1; i >= 0; i--) {
            if (contacts[i].firstName != null && contacts[i].firstName != "undefined") {
                contacts[i].firstLetter = contacts[i].firstName.charAt(0).toUpperCase();
                contacts[i].fullName = contacts[i].firstName + " " + contacts[i].lastName;
                contacts[i].isLetter = 0;
            }
        }
        for (var i = 0; i < letters.length; i++) {
            flag = false;
            var tmp = {
                "firstName": letters[i],
                "isLetter": 1
            }
            finalDoctors.push(tmp);
            for (var j = 0; j < contacts.length; j++) {
                if (contacts[j].firstName != null && contacts[j].firstName != "undefined") {
                    if (letters[i] == contacts[j].firstLetter) {
                        finalDoctors.push(contacts[j]);
                        flag = true;
                    } else {
                        continue;
                    }
                }
            }
            if (flag == false) {
                finalDoctors.pop();
            }
        }
        dataDoctors.replaceAll(finalDoctors);

        endLoadingDoctors();

    }).catch(function(err) {
        console.log("Fetch data error");
        console.log(err.message);
    });
}
// kod kontakti
function fetchData() {
    final = [];
    // ТРЕБА ДА СЕ СМЕНИ
    var urlPatient = "http://192.168.1.110:8080/curandusproject/webapi/api/patients/providerId=1"
    console.log(urlPatient);
    fetch(urlPatient, {
        method: 'GET',
        headers: {
            "Content-type": "application/json"
        },
        dataType: 'json'
    }).then(function(response) {
        return response.json(); // This returns a promise
    }).then(function(contacts) {

        var flag = false;

        for (var i = contacts.length - 1; i >= 0; i--) {
            contacts[i].firstLetter = contacts[i].firstName.charAt(0).toUpperCase();
            contacts[i].fullName = contacts[i].firstName + " " + contacts[i].lastName;
            contacts[i].isLetter = 0;
        }
        for (var i = 0; i < letters.length; i++) {
            flag = false;
            var tmp = {
                "firstName": letters[i],
                "isLetter": 1
            }
            final.push(tmp);
            for (var j = 0; j < contacts.length; j++) {
                if (letters[i] == contacts[j].firstLetter) {
                    final.push(contacts[j]);
                    flag = true;
                } else {
                    continue;
                }
            }
            if (flag == false) {
                final.pop();
            }
        }
        data.replaceAll(final);
        endLoadingContacts();
        console.log("Success");
    }).catch(function(err) {
        console.log("Fetch data error");
        console.log(err.message);
    });
} // end function checkData

fetchData();
fetchDataDoctors();

function goToSelectType(e) {
    router.push("SelectType", {
        user: e.data
    });
}

function goToTreatment(e) {
    router.push("alert", {
        user: e.data
    });
}

function goToAddContact() {
    router.push("addContact", {});
}

function goToAddDoctors() {
    router.push("addDoctor", {});
}

function goToChat(e) {
    router.push("chat", {
        user: e.data
    });
}

module.exports = {
    fetchData: fetchData,
    data: data,
    dataDoctors: dataDoctors,
    isDoctors: isDoctors,
    goToSelectType: goToSelectType,
    goToAddContact: goToAddContact,
    goToAddDoctors: goToAddDoctors,
    setDoctors: setDoctors,
    setPatients: setPatients,
    goToTreatment: goToTreatment,
    isLoadingContacts: isLoadingContacts,
    reloadHandler: reloadHandler,
    reloadHandlerDoctors: reloadHandlerDoctors,
    isLoadingDoctors: isLoadingDoctors,
    goToChat: goToChat
};