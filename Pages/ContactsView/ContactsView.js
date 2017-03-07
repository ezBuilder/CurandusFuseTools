var Observable = require("FuseJS/Observable");
var activeUrl = require("Constants/SERVICE_URL.js");
var Storage = require("FuseJS/Storage");
var Modal = require("Modal");
var myToast = require("myToast");


var UserInfo = JSON.parse(Storage.readSync("userInfo"));

this.onParameterChanged(function(param) {
    if (param.newContact) {
        reloadHandler();
    } else if (param.newDoctor) {
        reloadHandlerDoctors();
    }
});


var isDoctors = Observable(false);
var data = Observable();
var dataDoctors = Observable();
var letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
var fullName = "";
var final = [];
var finalDoctors = [];

var isLoadingContacts = Observable(false);
var isLoadingDoctors = Observable(false);

searchString = Observable("");
searchString1 = Observable("");

function stringContainsString(main, filter) {
    return main.toLowerCase().indexOf(filter.toLowerCase()) != -1;
}

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


// var providerId = 1;
// var providerId = userInfo.providerId;

function fetchDataDoctors() {
    finalDoctors = [];
    // ТРЕБА ДА СЕ СМЕНИ
    var urlProvider = activeUrl.URL + "/curandusproject/webapi/api/getprovidersdatabyprovider/ProviderProviderId=" + UserInfo.providerId
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
            console.log("dsadasdasda", contacts[i].FirstName);
            if (contacts[i].FirstName != null && contacts[i].FirstName != "undefined") {
                contacts[i].firstLetter = contacts[i].FirstName.charAt(0).toUpperCase();
                contacts[i].fullName = contacts[i].FirstName + " " + contacts[i].LastName;
                //// dodadeno od moki go zemam full name za da go prikazham vo selekttype koga se odi kon selekttype od contacts
                fullName = contacts[i].fullName;
                contacts[i].isLetter = 0;
            }
        }
        for (var i = 0; i < letters.length; i++) {
            flag = false;
            var tmp = {
                "FirstName": letters[i],
                "isLetter": 1
            }
            finalDoctors.push(tmp);
            for (var j = 0; j < contacts.length; j++) {
                if (contacts[j].FirstName != null && contacts[j].FirstName != "undefined") {
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
    console.log("gggggggggggggggggggggggggggggggggg");
    final = [];
    // ТРЕБА ДА СЕ СМЕНИ
    var urlPatient = activeUrl.URL + "/curandusproject/webapi/api/patients/providerId=" + UserInfo.providerId
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
    e.data.num = Math.random();
    Storage.write("nameLastname", JSON.stringify(fullName));
    console.log("od tuka se prakja kon SelectType" + JSON.stringify(e.data));

    router.push("SelectType", {
        user: e.data
    });
}

function deleteContact(e) {
    var patientId = e.data.patientId;
    if (e.data.activetreatmenId != 0) {
        myToast.toastIt("You cannot delete this contact because it has active treatment!");
    } else {
        console.log(JSON.stringify(e.data.patientId));
        Modal.showModal(
            "Delete Contact",
            "Are you sure you want to delete " + e.data.fullName + "?", ["Yes", "No"],
            function(s) {
                if (s == "Yes") {
                    fetch(activeUrl.URL + "/curandusproject/webapi/api/deleteProviderPatient/" + UserInfo.providerId + "&&" + patientId, {
                        method: 'GET',
                        headers: {
                            "Content-type": "application/json"
                        }
                    }).then(function(response) {
                        return response.json(); // This returns a promise
                    }).then(function(responseObject) {
                        console.log("Success Delete Contact");
                        reloadHandler();
                    }).catch(function(err) {
                        console.log("Error", err.message);
                    });
                }
            });
    }

}

function deleteDoctor(e) {
    var providerContactId = e.data.ProviderDetail2l;
    Modal.showModal(
        "Delete Contact",
        "Are you sure you want to delete " + e.data.fullName + "?", ["Yes", "No"],
        function(s) {
            if (s == "Yes") {
                fetch(activeUrl.URL + "/curandusproject/webapi/api/deleteProviderProvider/" + UserInfo.providerId + "&&" + providerContactId, {
                    method: 'GET',
                    headers: {
                        "Content-type": "application/json"
                    }
                }).then(function(response) {
                    return response.json(); // This returns a promise
                }).then(function(responseObject) {
                    console.log("Success Delete Contact");
                    reloadHandlerDoctors();
                }).catch(function(err) {
                    console.log("Error", err.message);
                });
            }
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

var filteredItems = searchString.flatMap(function(searchValue) {
    return data.where(function(item) {
        return stringContainsString(item.firstName, searchValue);
    });
});



var filteredItems1 = searchString1.flatMap(function(searchValue) {
    return dataDoctors.where(function(item) {
        return stringContainsString(item.FirstName, searchValue);
    });
});

module.exports = {
    fetchData: fetchData,
    fetchDataDoctors: fetchDataDoctors,
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
    goToChat: goToChat,
    filteredItems: filteredItems,
    searchString: searchString,
    searchString1: searchString1,
    deleteDoctor: deleteDoctor,
    deleteContact: deleteContact,
    filteredItems1: filteredItems1
};