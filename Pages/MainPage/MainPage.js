var Observable = require("FuseJS/Observable");

var contactsView = require("ContactsView/ContactsView");

var contacts = Observable();
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

    contactsView.fetchDataDoctors();

});

module.exports = {
    contacts: contacts,
    errorMessage: errorMessage,
    isLoading: isLoading,
    toolbarSearch: toolbarSearch
};