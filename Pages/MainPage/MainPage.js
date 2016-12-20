var Observable = require("FuseJS/Observable");

var contacts = Observable();
var errorMessage = Observable();
var isLoading = Observable(false);

function endLoading() {
    isLoading.value = false;
}

function toolbarSearch() {
    console.log('da');
}

module.exports = {
    contacts: contacts,
    errorMessage: errorMessage,
    isLoading: isLoading,
    toolbarSearch: toolbarSearch
};