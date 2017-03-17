var Observable = require('FuseJS/Observable');
var activeUrl = require("Constants/SERVICE_URL.js");
var Storage = require("FuseJS/Storage");

var UserInfo = JSON.parse(Storage.readSync("userInfo"));

var phoneNumber = Observable("");
var name = Observable("");
var surname = Observable("");

var newContact = {};

function addContact() {

    if (phoneNumber.value != "" && name.value != "" && surname.value != "") {

        fetch(activeUrl.URL + "/curandusproject/webapi/api/addcontactpatient/providerId=" + UserInfo.providerId + "&phone=" + phoneNumber.value + "&firstName=" + name.value + "&lastName=" + surname.value + "&chatid=321321&roomid=321312312", {
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

            newContact.phoneNumber = phoneNumber.value;
            newContact.name = name.value;
            newContact.surname = surname.value;
            var tmp = phoneNumber.value;
            phoneNumber.value = "";
            name.value = "";
            surname.value = "";

            router.goto("main", {
                newContact: tmp
            });

        }).catch(function(err) {
            console.log("Error", err.message);
        });
    }

}

// router.goto("main");

module.exports = {
    addContact: addContact,
    phoneNumber: phoneNumber,
    name: name,
    surname: surname
};