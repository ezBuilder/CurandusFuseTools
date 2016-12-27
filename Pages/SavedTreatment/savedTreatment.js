var Observable = require("FuseJS/Observable")
var savedTreatments = Observable();
var selektirani = Observable("");
var lista=[];

//***************  GET ALL TREATMENTS BY PROVIDES 
function fetchData() {
        var url = "http://192.168.1.165:8081/curandusproject/webapi/api/getsavedtreatmenttemplatebyprovider/" + '2'
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
           for (var i = 0; i < data.length; i++) {
                savedTreatments.add(data[i]);
           }
          console.log("Vrati od api: "+JSON.stringify(savedTreatments));

        }).catch(function(err) { 
            console.log("Fetch data error"); 
            console.log(err.message); 
        }); 
}// end function checkData 

// **************** GET ITEMS FOR SELECTED TREATMENT *******************************
  
  //******  GET SAVED TREATMENT ITEMS BY SAVED TREATMENT ITEM ID ********
        function fetchDataBySavedTreatment(id){
            selektirani.clear();
            var url = "http://192.168.1.165:8081/curandusproject/webapi/api/gettreatmentitemssbytreatment/treatmentId="+id+"&typetreatment=S" 
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
                for(var i = 0; i < data.length; i++){
                    selektirani.add(data[i].name);
                    lista[i] = data[i].name;
                   // console.log("FETCH DATA BY SAVED TREATMENTS: " + JSON.stringify(selektirani));
                }
                goToSavedTreatments(lista);

            }).catch(function(err) {
                console.log("Fetch data error");
                console.log(err.message);
            });
        } // end function fetchDataBySavedTreatment


function getItemsForTemplate(item){
    console.log("GET ITEMS FOR TEMPLATE: " + JSON.stringify(item)); 
    var id = item.data.savedTreatmentTemplateId;
    console.log("GET ITEMS FOR TEMPLATE ID: " + id); 
    fetchDataBySavedTreatment(id);
    	
}


function goToSavedTreatments(e){
   
   	router.push("SelectType", e);
}

fetchData();  // <--------- CALL FUNCTION FOR DATA FETCH ABOUT SAVED TREATMENTS

module.exports = {
	fetchData:fetchData, 
	savedTreatments:savedTreatments, 
	getItemsForTemplate:getItemsForTemplate, 
    goToSavedTreatments:goToSavedTreatments ,
    fetchDataBySavedTreatment:fetchDataBySavedTreatment

}