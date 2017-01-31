   var Observable = require("FuseJS/Observable")
   var Storage = require("FuseJS/Storage");

   var UserInfo = JSON.parse(Storage.readSync("userInfo"));

   exports.values = Observable();

   var user = Observable();

   var selektirani = [];

   exports.list = Observable("")
   exports.values.onValueChanged(module, function() {
       exports.list.value = exports.values.toArray().join(",")
       console.log("values: " + exports.values);
   })

   this.onParameterChanged(function(param) {
       user.value = param.user;
   })

   function goToSavedTreatments(e) {
       router.push("savedTreatment", {});

   }

   //***************  GET SAVED TREATMENT ITEMS BY SAVED TREATMENT ITEM ID ********
   function fetchDataBySavedTreatment(id) {
       var url = "http://192.168.1.110:8080/curandusproject/webapi/api/gettreatmentitemssbytreatment/treatmentId=" + id + "&typetreatment=S"
       console.log(url);
       fetch(url, {
           method: 'GET',
           headers: {
               "Content-type": "application/json"
           },
           dataType: 'json'
       }).then(function(response) {
           status = response.status; // Get the HTTP status code
           response_ok = response.ok; // Is response.status in the 200-range?
           return response.json(); // This returns a promise
       }).then(function(data) {

           console.log("OVIE TREBA DA SE SELEKTIRANI");

       }).catch(function(err) {
           console.log("Fetch data error");
           console.log(err.message);
       });
   } // end function fetchDataBySavedTreatment

   this.onParameterChanged(function(param) {
       console.log("parametaaaaaaaaaaaaaaar: " + JSON.stringify(param));
       var savedTreatmentTemplateId = param.savedTreatmentTemplateId;

       console.log("parametoooooooooooooooor: " + savedTreatmentTemplateId);
       fetchDataBySavedTreatment(savedTreatmentTemplateId);
       console.log("valuuuuuuuuuuuuuuuuuuuuuuues: " + JSON.stringify(exports.values));

   });

   module.exports = {
       goToSavedTreatments: goToSavedTreatments,
       user: user,
       fetchDataBySavedTreatment: fetchDataBySavedTreatment
   }