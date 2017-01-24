var Observable = require('FuseJS/Observable');

var phoneNumber = Observable("");
var name = Observable("");
var surname = Observable("");

var newContact = {};

function addContact() {

    if (phoneNumber.value != "" && name.value != "" && surname.value != "") {

        fetch("http://192.168.1.165:8081/curandusproject/webapi/api/addcontactpatient/providerId=" + 1 + "&phone=" + phoneNumber.value + "&firstName=" + name.value + "&lastName=" + surname.value, {
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

            phoneNumber.value = "";
            name.value = "";
            surname.value = "";

            router.goto("main", {
                reload: true
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