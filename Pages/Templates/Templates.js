var Observable = require("FuseJS/Observable");

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