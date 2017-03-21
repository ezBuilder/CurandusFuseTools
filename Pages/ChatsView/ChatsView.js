var Observable = require("FuseJS/Observable");

var activeUrl = require("Constants/SERVICE_URL.js");
var QConfig = require('Scripts/quickbloxConfig.js');
var Storage = require("FuseJS/Storage");

var User = JSON.parse(Storage.readSync("userInfo"));
var contacts = Observable();
var dialogs = Observable();
var errorMessage = Observable();

console.log("DAAAAAAAAAAAAAAAAAAA***********************");

var sessionObj;
var userObj;

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
            signIn();

        })
        .catch(function(err) {
            console.log('Error');
            console.log(JSON.stringify(err));
        });
}
createSession();

function signIn() {

    var data = {
        "login": User.phone,
        "password": QConfig.password
    }

    console.log(JSON.stringify(data));

    fetch('http://api.quickblox.com/login.json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'QuickBlox-REST-API-Version': "0.1.0",
                'QB-Token': sessionObj.token
            },
            body: JSON.stringify(data)
        })
        .then(function(resp) {
            return resp.json();
            console.log(JSON.stringify(resp));
        })
        .then(function(json) {
            userObj = json.user;

            console.log(JSON.stringify("USER 2", userObj));
            // getAllMesages();
            getDialogs();

        })
        .catch(function(err) {
            console.log('Error');
            console.log(JSON.stringify(err));
        });
}

function getDialogs() {
    // https://api.quickblox.com/chat/Dialog.json

    fetch('https://api.quickblox.com/chat/Dialog.json', {
            method: 'GET',
            headers: {
                'QB-Token': sessionObj.token
            }
        })
        .then(function(resp) {
            return resp.json();
        })
        .then(function(json) {
            console.log("DIALOGSSSSSSSSSSSS", JSON.stringify(json.items));

            for (var i = 0; i < json.items.length; i++) {
                var d = new Date(json.items[i].last_message_date_sent * 1000);
                json.items[i].minutes = timeSince(d);

                console.log(json.items[i].occupants_ids[2]);
                // console.log(getName(json.items[i].occupants_ids[2]));
                // json.items[i].occupants_ids[3]

            }

            dialogs.replaceAll(json.items);
        })
        .catch(function(err) {
            console.log('Error');
            console.log(JSON.stringify(err));
        });
}


fetch("http://www.filltext.com/?rows=10&fname={firstName}&lname={lastName}&lorem={lorem|6}&minutes={numberRange|1,%209}&pretty=true")
    .then(function(result) {
        if (result.status !== 200) {
            debug_log("Something went wrong, status code: " + result.status);
            errorMessage.value = "Oh noes! :(";
            return;
        }

        //throw "Some error";
        return result.json();

    }).then(function(data) {
        debug_log("Success!");

        for (var i = data.length - 1; i >= 0; i--) {
            data[i].minutes = (data[i].minutes + " minutes ago");
            data[i].fname = (data[i].fname + " " + data[i].lname);
            contacts.add(data[i]);
        }

    }).catch(function(error) {
        debug_log("Fetch error " + error);
        errorMessage.value = "Oh noes! :(";
    });

function goToChat(e) {
    router.push("chat", {
        user: e.data
    });
}


function getName(id) {
    fetch('http://api.quickblox.com/users/25180821.json', {
            method: 'GET',
            headers: {
                'QuickBlox-REST-API-Version': "0.1.0",
                'QB-Token': sessionObj.token
            },
            body: JSON.stringify(signData)
        })
        .then(function(resp) {
            console.log("userFound");
            return resp.json();
        })
        .then(function(json) {
            console.log(JSON.stringify(json));
            // return json.user.full_name;

        })
        .catch(function(err) {
            console.log('Error');
            console.log(JSON.stringify(err));
        });
}

function goToDoctorChat2(e) {
    console.log(JSON.stringify(e));
    // return null;
    router.push("chat", {
        doctorChatRoomId2: e.data
    });

}

function timeSince(date) {

    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
        return interval + " years";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " months";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " days";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " hours";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutes";
    }
    return Math.floor(seconds) + " seconds";
}

module.exports = {
    contacts: contacts,
    dialogs: dialogs,
    getDialogs: getDialogs,
    signIn: signIn,
    errorMessage: errorMessage,
    goToChat: goToChat,
    goToDoctorChat2: goToDoctorChat2,
};