var Observable = require('FuseJS/Observable');

var phoneNumber = Observable("");
var name = Observable("");
var surname = Observable("");

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

            phoneNumber.value = "";
            name.value = "";
            surname.value = "";

            router.goBack();

        }).catch(function(err) {
            console.log("Error", err.message);
        });

    }

}

module.exports = {
    addContact: addContact,
    phoneNumber: phoneNumber,
    name: name,
    surname: surname
};