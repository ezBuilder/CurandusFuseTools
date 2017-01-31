var Observable = require("FuseJS/Observable")
var savedTreatments = Observable();
var selektirani = Observable("");
 var Storage = require("FuseJS/Storage");
var lista=[];

var userInfo = JSON.parse(Storage.readSync("userInfo"));//Storage.readSync("userInfo");
//var providerId = JSON.parse(userInfo.providerId);
console.log("OVA E user info  yyyy: "+userInfo);


var providerId=JSON.stringify(userInfo.providerId);

console.log("OVA E PROVIDER ID yyyy: "+providerId);

//***************  GET ALL TREATMENTS BY PROVIDERS 
function fetchData() {
        // var userInfo = Storage.readSync("userInfo");
        // var providerId = userInfo.providerId;
        console.log("OVA E PROVIDER ID: "+providerId);

        var url = "http://192.168.1.165:8081/curandusproject/webapi/api/getsavedtreatmenttemplatebyprovider/"+providerId
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


//////******  GET SAVED TREATMENT ITEMS BY SAVED TREATMENT ITEM ID ********
function fetchDataBySavedTreatment(id){ 
    //console.log("fetchDataBySavedTreatment DATA: "+JSON.stringify(selektirani));
    //console.log("iddddddddddddddddddddddddddddddd"+id);
   
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
                //lista[i] = data[i].name;
                ///////////
                var tmp = {
                            "name": data[i].name,
                            "duration": data[i].duration,
                            "created": data[i].created,
                            "modified": data[i].modified,
                            "modifiedBy": data[i].modifiedBy,
                            "typeT": data[i].typeT,
                            "repeatT": data[i].repeatT,
                            "renderingInfo": data[i].renderingInfo,
                            "createdBy": data[i].createdBy,
                            "treatmentItemId": data[i].treatmentItemId,
                            "subtreatmentid": data[i].subtreatmentid
                        }
                lista[i] = tmp;
                ///////////
                console.log("FETCH DATA BY SAVED TREATMENTS: " + JSON.stringify(tmp)); 
            }
        goToSavedTreatments(lista);

        }).catch(function(err) {
            console.log("Fetch data error");
            console.log(err.message);
        });
} // end function fetchDataBySavedTreatment


function getItemsForTemplate(item){
   // console.log("GET ITEMS FOR TEMPLATE: " + JSON.stringify(item)); 
    var id = item.data.savedTreatmentTemplateId; 
    //console.log("GET ITEMS FOR TEMPLATE ID: " + id); 
    fetchDataBySavedTreatment(id); 
} 


function goToSavedTreatments(e){
    console.log("NAJBITNOOO ***",JSON.stringify(e)); 
    e.push({"num":Math.random()}); 
    console.log("NAJBITNOOO-->>>",JSON.stringify(e)); 
    console.log("NAJBITNOOO----- ",e.length); 
    router.push("SelectType", e );
}

fetchData();  // <--- CALL FUNCTION FOR DATA FETCH ABOUT SAVED TEMPLATE

module.exports = {
    fetchData:fetchData, 
    savedTreatments:savedTreatments, 
    getItemsForTemplate:getItemsForTemplate, 
    goToSavedTreatments:goToSavedTreatments ,
    fetchDataBySavedTreatment:fetchDataBySavedTreatment

}