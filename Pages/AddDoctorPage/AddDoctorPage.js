var Observable = require('FuseJS/Observable');
var activeUrl = require("Constants/SERVICE_URL.js");
var Storage = require("FuseJS/Storage");

var User;

var phoneNumber = Observable("");
var name = Observable("");
var surname = Observable("");

Storage.read("userInfo").then(function(content) {
    User = JSON.parse(content);
}, function(error) {

});

this.onParameterChanged(function(param) {
    if (param.localContact) {

        phoneNumber.value = param.localContact.phoneNumber;
        name.value = param.localContact.name;
        surname.value = param.localContact.surname;

    }
});

function addContact() {

    if (phoneNumber.value != "" && name.value != "" && surname.value != "") {

        fetch(activeUrl.URL + "/curandusproject/webapi/api/addcontactdoctor/providerId=" + User.providerId + "&phone=" + phoneNumber.value + "&firstName=" + name.value + "&lastName=" + surname.value + "&chatid=321321&roomid=321312312", {
            method: 'POST',
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
            var tmp = phoneNumber.value;
            var text = "LINK TO APP";

            sendsms(tmp, text);

            phoneNumber.value = "";
            name.value = "";
            surname.value = "";

            router.goto("main", {
                newDoctor: tmp
            });

        }).catch(function(err) {
            console.log("Error", err.message);
        });

    }

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

function goToLocal() {
    router.push("LocalContacts");
}


module.exports = {
    addContact: addContact,
    goToLocal: goToLocal,
    phoneNumber: phoneNumber,
    name: name,
    surname: surname
};