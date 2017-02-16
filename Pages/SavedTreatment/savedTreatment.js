var Observable = require("FuseJS/Observable")

var selektirani = Observable("");
var Storage = require("FuseJS/Storage");
var Modal = require("Modal");
var lista = [];
var savedTreatments = Observable();
var userInfo = JSON.parse(Storage.readSync("userInfo"));//Storage.readSync("userInfo");
var name = Observable("");
//var providerId = JSON.parse(userInfo.providerId);

console.log("OVA E user info  yyyy: " + userInfo);
var providerId = JSON.stringify(userInfo.providerId);
console.log("OVA E PROVIDER ID yyyy: " + providerId);

//***************  GET NAME BY PATIENT 
name.value = JSON.parse(Storage.readSync("nameLastname"));
console.log("*VO SAVED TREATMENTS NAME"+name);

/////////////////////// REMOVE TREATMENT TEMPLATE ////////////////////////////////////
function RemoveItem(sender) {
    console.log(JSON.stringify(sender.data.nameTreatment));
    Modal.showModal(
        "Delete Treatment",
        "Are you sure you want to delete " + sender.data.nameTreatment + " ?", ["Yes", "No"],
        function(s) {
            if (s == "Yes") {
                console.log("REMOVE TREATMENT TEMPLATE: " + sender.data.savedTreatmentTemplateId);
                var url = "http://192.168.1.165:8081/curandusproject/webapi/api/DeleteSavedTemplate/" + sender.data.savedTreatmentTemplateId + "&&" + sender.data.savedTreatmentTemplateId
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
                    //remove template item from list --> sender
                    Remove(sender);
                    console.log("DELETED TEMPLATE: " + JSON.stringify(data));

                }).catch(function(err) {
                    console.log("Fetch data error");
                    console.log(err.message);
                });

            }
        });




}

/////////////// Remove template item from front end templatelist
function Remove(sender) {
    console.log("OVA E ITEMOT SHTO SE BRISHE : " + JSON.stringify(sender));
    savedTreatments.remove(sender.data);
    for (var i = 0; i < savedTreatments.length; i++) {
        savedTreatments.getAt(i).index.value = i;
    }
}



//////******  GET SAVED TREATMENT ITEMS BY SAVED TREATMENT ITEM ID ********
function fetchDataBySavedTreatment(id, templateName) {

    lista = [];
    var url = "http://192.168.1.165:8081/curandusproject/webapi/api/gettreatmentitemssbytreatment/treatmentId=" + id + "&typetreatment=S"
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
            //selektirani.add(data[i].name);
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
            console.log("FETCH DATA BY SAVED TREATMENTS - SELEKTIRANI: " + JSON.stringify(selektirani));
        }
        goToSelectType(lista, id, templateName);

    }).catch(function(err) {
        console.log("Fetch data error");
        console.log(err.message);
    });
} // end function fetchDataBySavedTreatment


function getItemsForTemplate(item) {
    console.log("Data na klik na template: " + JSON.stringify(item.data));
    var id = item.data.savedTreatmentTemplateId;
    var templateName = item.data.nameTreatment;
    //console.log("Na klik na template: " + id); 
    fetchDataBySavedTreatment(id, templateName);
}


function goToSelectType(e, id, templateName) {
    //console.log("NAJBITNOOO ***",JSON.stringify(e)); 
    e.push({
        "num1": Math.random()
    });
    e.push({
        "id": id
    })
    e.push({
        "templateName": templateName
    })

    console.log("Data shto se prakja do SelectType", JSON.stringify(e));
    console.log("dolzhina na data shto se prakja do SelectType: -----> ", e.length);
    router.push("SelectType", {
        savedTreatments: e
    });
}


this.onParameterChanged(function(param) {
    savedTreatments.clear();
    console.log("Tuka se stigna vo savedTreatments" + JSON.stringify(param));
    for (var i = 0; i < param.length; i++) {
        if (param[i].name) {
            console.log("OVA E IMETO STIGNATO OD SELECT TYPE VO FOR:" + param[i].name);
            name.value = param[i].name;
        } else {
            console.log("vo for stignato: " + param[i].nameTreatment);
            savedTreatments.add(param[i]);
        }
        // console.log("OVA E IMETO STIGNATO OD SELECT TYPE:"+param[i].name);
        console.log("OVA E IMETO STIGNATO OD SELECT TYPE:" + name.value);

    }
});

// <--- CALL FUNCTION FOR DATA FETCH ABOUT SAVED TEMPLATE

module.exports = {

    getItemsForTemplate: getItemsForTemplate,
    goToSelectType: goToSelectType,
    fetchDataBySavedTreatment: fetchDataBySavedTreatment,
    savedTreatments: savedTreatments,
    name: name,
    RemoveItem: RemoveItem


}