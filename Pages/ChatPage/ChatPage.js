var Observable = require("FuseJS/Observable");
var activeUrl = require("Constants/SERVICE_URL.js");
var QConfig = require('Scripts/quickbloxConfig.js');

var user = Observable();
var sessionObj;
var userObj;

this.onParameterChanged(function(param) {

    if (param.doctorChatRoomId) {
        messages.replaceAll([]);
        console.log("CHAT SOBA - " + JSON.stringify(param.doctorChatRoomId));
        user.value = param.doctorChatRoomId;
        console.log(user.value.ChatId)
        console.log(user.value.RoomId)
        createSession();
    }

    user.value = param.user;
    console.log("da", JSON.stringify(user));
})

function getAllMesages() {

    // fetch('https://api.quickblox.com/chat/Message.json?chat_dialog_id='+ user.value.RoomId +'&limit=10&sort_desc=date_sent', {
    fetch('https://api.quickblox.com/chat/Message.json?chat_dialog_id=5898637ca0eb478bb7000015&limit=10&sort_desc=date_sent', {
            method: 'GET',
            headers: {
                'QB-Token': sessionObj.token
            }
        })
        .then(function(resp) {
            console.log("All Messages");
            return resp.json();
        })
        .then(function(json) {
            console.log(JSON.stringify(json));

            messages.replaceAll([]);
            for (var i = json.items.length - 1; i >= 0; i--) {

                var tmpDate = new Date(json.items[i].date_sent * 1000);
                var days = tmpDate.getDate();
                var months = tmpDate.getMonth() + 1;
                var year = tmpDate.getFullYear();
                var hours = tmpDate.getHours();
                var min = tmpDate.getMinutes();

                var fullDate = ('0' + tmpDate.getDate()).slice(-2) + '.' + ('0' + (tmpDate.getMonth() + 1)).slice(-2) + '.' + tmpDate.getFullYear();
                var fulltime = ('0' + hours).slice(-2) + ':' + ('0' + min).slice(-2);

                if (json.items[i].sender_id == user.value.ChatId) {
                    // if (json.items[i].sender_id == 23691187) {
                    messages.add(new Message("You", fulltime, json.items[i].message, "Right"));
                } else if (json.items[i].sender_id == 23691179) {
                    messages.add(new Message("Curandus", fulltime, json.items[i].message, "Top"));
                } else {
                    messages.add(new Message("Patient", fulltime, json.items[i].message, "Left"));
                }
            }

        })
        .catch(function(err) {
            console.log('Error');
            console.log(JSON.stringify(err));
        });
}

function Message(from, time, text, dock) {
    this.from = from;
    this.time = time;
    this.text = text;
    this.dock = dock;
}

var messages = Observable();

var message = Observable("");

function signIn(username, password) {

    var data = {
        "login": username,
        "password": password
    }

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
            console.log("User LoggedIn");
            return resp.json();
        })
        .then(function(json) {
            userObj = json.user;

            console.log(JSON.stringify(userObj));
            getAllMesages();

        })
        .catch(function(err) {
            console.log('Error');
            console.log(JSON.stringify(err));
        });
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

            signIn("testuser1", "testuser1");

        })
        .catch(function(err) {
            console.log('Error');
            console.log(JSON.stringify(err));
        });
}

function addMesageToChat() {

    if (message.value !== "") {

        var data = {
            // "chat_dialog_id": user.value.RoomId,
            "chat_dialog_id": "5898637ca0eb478bb7000015",
            "message": message.value,
            "send_to_chat": 1
        };

        fetch('https://api.quickblox.com/chat/Message.json', {
                method: 'POST',
                headers: {
                    'Content-Type': "application/json",
                    'QB-Token': sessionObj.token
                },
                body: JSON.stringify(data)
            })
            .then(function(resp) {
                return resp.json();
            })
            .then(function(json) {
                console.log('JSON:' + JSON.stringify(json));
                var tmpDate = new Date(json.date_sent * 1000);
                var days = tmpDate.getDate();
                var months = tmpDate.getMonth() + 1;
                var year = tmpDate.getFullYear();
                var hours = tmpDate.getHours();
                var min = tmpDate.getMinutes();

                var fullDate = ('0' + tmpDate.getDate()).slice(-2) + '.' + ('0' + (tmpDate.getMonth() + 1)).slice(-2) + '.' + tmpDate.getFullYear();
                var fulltime = ('0' + hours).slice(-2) + ':' + ('0' + min).slice(-2);

                messages.add(new Message("You", fulltime, message.value, "Right"));
                message.value = "";
            })
            .catch(function(err) {
                console.log('Error');
                console.log(JSON.stringify(err));
            });
    }
}


function goToUser(userId) {
    console.log("UserID" + JSON.stringify(user));

    router.push("alert", {
        user: JSON.stringify(user)
    });
}


module.exports = {
    user: user,
    goToUser: goToUser,
    addMesageToChat: addMesageToChat,
    messages: messages.map(function(message) {
        return {
            info: message.from + " at " + message.time,
            text: message.text,
            dock: message.dock
        };
    }),
    message: message,
    canSendMessage: message.map(function(value) {
        return value !== "";
    })
};