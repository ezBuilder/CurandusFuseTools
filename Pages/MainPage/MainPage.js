var Observable = require("FuseJS/Observable");

var Contacts = require("Pages/ContactsView/ContactsView.js");
var errorMessage = Observable();
var isLoading = Observable(false);

function endLoading() {
    isLoading.value = false;
}

function toolbarSearch() {
    console.log('da');
}


this.Parameter.onValueChanged(module, function(param) {
    // lookup channel with id "param"
    console.log("We should RELOAD " + JSON.stringify(param.reload));

    Contacts.reloadHandler();
    Contacts.reloadHandlerDoctors();

});

module.exports = {
    errorMessage: errorMessage,
    isLoading: isLoading,
    toolbarSearch: toolbarSearch
};