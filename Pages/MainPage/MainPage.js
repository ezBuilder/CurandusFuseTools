var Observable = require("FuseJS/Observable");
var activeUrl = require("Constants/SERVICE_URL.js");
var Storage = require("FuseJS/Storage");

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

// FOR TESTING ONLY
function deleteStorage() {
    var success = Storage.deleteSync("userInfo");
    if (success) {
        console.log("Deleted file");
    } else {
        console.log("An error occured!");
    }
}

module.exports = {
    errorMessage: errorMessage,
    isLoading: isLoading,
    deleteStorage: deleteStorage,
    toolbarSearch: toolbarSearch
};