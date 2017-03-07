var Observable = require("FuseJS/Observable");
var activeUrl = require("Constants/SERVICE_URL.js");

var user = Observable();

this.onParameterChanged(function(param) {
    user.value = param.user;
    console.log("da", JSON.stringify(user));
})

function goToUser(userId) {

    console.log("UserID" + JSON.stringify(user));

    router.push("alert", {
        user: JSON.stringify(user)
    });

}

module.exports = {
    user: user,
    goToUser: goToUser,
};