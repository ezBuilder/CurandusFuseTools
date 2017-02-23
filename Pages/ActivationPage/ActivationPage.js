var Observable = require("FuseJS/Observable");
var activeUrl = require("Constants/SERVICE_URL.js");
var Storage = require("FuseJS/Storage");

var register = Observable();

var inputCode = Observable();

this.onParameterChanged(function(param) {
    console.log("We should now display user with id: " + JSON.stringify(param.register));
    register.value = param.register;

});

function goToMain() {
    router.goto("main");
}

function goBack() {
    router.goBack();
}

function checkData() {

    var url = activeUrl.URL + "/curandusproject/webapi/api/CheckProviderActivationKey/" + register.value.deviceId + "&&" + register.value.phone + "&&" + inputCode.value;

    console.log("url " + url);
    fetch(url, {
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
        if (responseObject.providerId) {
            var userInfo = Observable();
            userInfo.value = responseObject;

            Storage.write("userInfo", JSON.stringify(userInfo.value));
            goToMain();
        }
        console.log("Success");

    }).catch(function(err) {
        console.log("lol Error");
        console.log(err.message);
    });
}

module.exports = {
    checkData: checkData,
    goToMain: goToMain,
    goBack: goBack,
    inputCode: inputCode
};