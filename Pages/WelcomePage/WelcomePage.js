var Storage = require("FuseJS/Storage");
var activeUrl = require("Constants/SERVICE_URL.js");

function isLogged() {

    Storage.read("userInfo").then(function(content) {
        debug_log("Registered");
        debug_log(content);
        goToMain();
    }, function(error) {
        debug_log("Not Registered");
        goToLogin();
    });

}

function goToLogin() {
    router.goto("login");
}

function goToMain() {
    router.goto("main");
}

setTimeout(function() {
    isLogged();
}, 1500);