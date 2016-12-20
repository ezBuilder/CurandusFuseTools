var Observable = require("FuseJS/Observable");

var contacts = Observable();
var errorMessage = Observable();

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

module.exports = {
    contacts: contacts,
    errorMessage: errorMessage,
    goToChat: goToChat
};