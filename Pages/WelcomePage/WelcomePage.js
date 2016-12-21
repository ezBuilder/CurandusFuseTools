var Storage = require("FuseJS/Storage");

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
    router.push("login");
}

function goToMain() {
    router.push("main");
}

setTimeout(function() {
    isLogged();
}, 1500);