var Observable = require("FuseJS/Observable");

var user = Observable();

this.onParameterChanged(function(param) {
    console.log("We should now display user with id: " + JSON.stringify(param.user));

    user.value = param.user;
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