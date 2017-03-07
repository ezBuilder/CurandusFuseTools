var Observable = require("FuseJS/Observable");
var activeUrl = require("Constants/SERVICE_URL.js");

var errorMessage = Observable();
var isLoading = Observable(false);

this.onParameterChanged(function(param) {
    if (param.user) {
        console.log("main " + param.user);
        router.push("alert", {
            user: param.user
        });
        console.log("posle push " + param.user);
    }
});

function endLoading() {
    isLoading.value = false;
}

function toolbarSearch() {
    console.log('da');
}


module.exports = {
    errorMessage: errorMessage,
    isLoading: isLoading,
    toolbarSearch: toolbarSearch
};