var Observable = require("FuseJS/Observable");

var errorMessage = Observable();
var isLoading = Observable(false);

    this.onParameterChanged(function(param) { 
    	console.log("main "+param.user);
		 router.push("alert", {user:param.user}); 

		 console.log("posle push "+param.user);
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