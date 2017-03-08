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

function createSession() {

    var data = {
        'application_id': QConfig.appId,
        'auth_key': QConfig.authKey,
        'nonce': Math.floor(Math.random() * 1000),
        'timestamp': new Date().getTime() / 1000
    }

    var signData = QConfig.getSignedData(data);

    console.log(JSON.stringify(signData));

    fetch('https://api.quickblox.com/session.json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'QuickBlox-REST-API-Version': "0.1.0"
            },
            body: JSON.stringify(signData)
        })
        .then(function(resp) {
            console.log("Session Created");
            return resp.json();
        })
        .then(function(json) {
            sessionObj = json.session;

        })
        .catch(function(err) {
            console.log('Error');
            console.log(JSON.stringify(err));
        });
}

setTimeout(function() {
    isLogged();
}, 1500);