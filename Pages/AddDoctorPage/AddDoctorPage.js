var Observable = require('FuseJS/Observable');
var activeUrl = require("Constants/SERVICE_URL.js");
var Storage = require("FuseJS/Storage");
var myToast = require("myToast");
var QConfig = require('Scripts/quickbloxConfig.js');

var sessionObj;
var userObj;
var User;

var userChatId = "";
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

createSession();

function addChatContact() {

    if (phoneNumber.value != "" && name.value != "" && surname.value != "" && sessionObj) {

        name.value=encodeURIComponent(name.value);
        surname.value=encodeURIComponent(surname.value);

        var data = {
            "user": {
                "login": phoneNumber.value,
                "password": QConfig.password,
                "email": phoneNumber.value + "@curandus.com",
                "full_name": name.value + " " + surname.value + ""
            }
        }

        fetch('http://api.quickblox.com/users.json', {
                method: 'POST',
                headers: {
                    'Content-Type': "application/json,",
                    'QuickBlox-REST-API-Version': "0.1.0",
                    'QB-Token': sessionObj.token
                },
                body: JSON.stringify(data)
            })
            .then(function(resp) {
                return resp.json();
            })
            .then(function(json) {
                console.log(JSON.stringify(json));
                var chatUserId;
                if (json.user) {
                    console.log("USER CREATED " + JSON.stringify(json.user.id));
                    chatUserId = json.user.id;

                    var data = {
                        "login": User.phone,
                        "password": QConfig.password
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

                            // createDialog(userObj.id, chatUserId)

                            var data = {
                                "type": 2,
                                "name": "Chat with " + userObj.id + " & " + chatUserId,
                                "occupants_ids": "25381537," + userObj.id + "," + chatUserId + ""
                            }

                            fetch('https://api.quickblox.com/chat/Dialog.json', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'QB-Token': sessionObj.token
                                    },
                                    body: JSON.stringify(data)
                                })
                                .then(function(resp) {
                                    console.log("Dialog Created");
                                    return resp.json();
                                })
                                .then(function(json) {
                                    dialogObj = json;
                                    console.log("DIALOG!" + dialogObj._id);
                                    // addContact(chatUserId, dialogObj._id);

                                    fetch(activeUrl.URL + "/curandusproject/webapi/api/addcontactdoctor/providerId=" + User.providerId + "&phone=" + phoneNumber.value + "&firstName=" + name.value + "&lastName=" + surname.value + "&chatid=" + chatUserId + "&roomid=" + dialogObj._id, {
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
                                        var text = "Link to App!";
                                        // sendSms(tmp, text);

                                        phoneNumber.value = "";
                                        name.value = "";
                                        surname.value = "";


                                        router.goto("main", {
                                            newDoctor: tmp
                                        });

                                    }).catch(function(err) {
                                        console.log("Error add?", err.message);
                                    });

                                    console.log(JSON.stringify(dialogObj));
                                })
                                .catch(function(err) {
                                    console.log('Error ovde?');
                                    console.log(JSON.stringify(err));
                                });

                            console.log(JSON.stringify(userObj));

                        })
                        .catch(function(err) {
                            console.log('Error');
                            console.log(JSON.stringify(err));
                        });

                } else
                if (json.errors.email[0] == "has already been taken."||json.errors.login[0] == "has already been taken.") {
                    console.log(JSON.stringify(json.errors.login[0]));

                    fetch('http://api.quickblox.com/users/by_login.json?login=' + phoneNumber.value, {
                            method: 'GET',
                            headers: {
                                'QuickBlox-REST-API-Version': "0.1.0",
                                'QB-Token': sessionObj.token
                            }
                        })
                        .then(function(resp) {
                            console.log("User Found!");
                            return resp.json();
                        })
                        .then(function(json) {
                            console.log('JSON POSTOI:' + JSON.stringify(json));

                            chatUserId = json.user.id;

                            var data = {
                                "login": User.phone,
                                "password": QConfig.password
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


                                    createDialog(userObj.id, chatUserId)


                                    console.log(JSON.stringify(userObj));

                                })
                                .catch(function(err) {
                                    console.log('Error');
                                    console.log(JSON.stringify(err));
                                });


                            console.log(chatUserId);



                        })
                        .catch(function(err) {
                            console.log('Error');
                            console.log(JSON.stringify(err));
                        });

                }
            })
            .catch(function(err) {
                console.log('Error');
                console.log(JSON.stringify(err));
            });

    } else {
        myToast.toastIt("All fields are required!")
    }

}

function createDialog(myUserId, contactId) {

    var data = {
        "type": 2,
        "name": "Chat with" + myUserId + " & " + contactId,
        "occupants_ids": "25381537," + myUserId + "," + contactId + "",
        "UsersForChat": {
            "user1": "" + name.value + " " + surname.value + "",
            "user2": "" + User.firstName + ' ' + User.lastName + ""
        },

    }

    console.log("    aAaaaaaaaaaaaaaaaaaaaaaa " + data);

    fetch('https://api.quickblox.com/chat/Dialog.json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'QB-Token': sessionObj.token
            },
            body: JSON.stringify(data)
        })
        .then(function(resp) {
            console.log("Dialog Created 2");
            return resp.json();
        })
        .then(function(json) {
            dialogObj = json;
            console.log("DIALOG!" + dialogObj._id + contactId);
            // addContact(contactId, dialogObj._id);
            fetch(activeUrl.URL + "/curandusproject/webapi/api/addcontactdoctor/providerId=" + User.providerId + "&phone=" + phoneNumber.value + "&firstName=" + name.value + "&lastName=" + surname.value + "&chatid=" + contactId + "&roomid=" + dialogObj._id, {
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
                var text = "Link to App!";
                sendSms(tmp, text);

                phoneNumber.value = "";
                name.value = "";
                surname.value = "";


                router.goto("main", {
                    newDoctor: tmp
                });

            }).catch(function(err) {
                console.log("Error add?", err.message);
            });

            console.log(JSON.stringify(dialogObj));
        })
        .catch(function(err) {
            console.log('Error ovde?');
            console.log(JSON.stringify(err));
        });
}

function addContact(chatID, roomID) {
    console.log(chatID + " - " + roomID);
    if (phoneNumber.value != "" && name.value != "" && surname.value != "") {
        fetch(activeUrl.URL + "/curandusproject/webapi/api/addcontactdoctor/providerId=" + User.providerId + "&phone=" + phoneNumber.value + "&firstName=" + name.value + "&lastName=" + surname.value + "&chatid=" + chatID + "&roomid=" + roomID, {
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
            var text = "Link to App!";
            sendSms(tmp, text);


            phoneNumber.value = "";
            name.value = "";
            surname.value = "";


            router.goto("main", {
                newDoctor: tmp
            });

        }).catch(function(err) {
            console.log("Error add?", err.message);
        });

    } else {
        myToast.toastIt("All fields are required!")
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
    addChatContact: addChatContact,
    goToLocal: goToLocal,
    phoneNumber: phoneNumber,
    name: name,
    surname: surname
};