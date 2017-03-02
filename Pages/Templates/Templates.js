var Observable = require("FuseJS/Observable");
var activeUrl = require("Constants/SERVICE_URL.js");

var user = Observable();

this.onParameterChanged(function(param) {
    user.value = param.user;
})

function goToSelectItems(e) {
    router.push("SelectItems", {
        user: e.data
    });
}

module.exports = {
    user: user,
    goToSelectItems: goToSelectItems
}