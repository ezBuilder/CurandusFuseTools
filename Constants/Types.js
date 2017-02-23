var Observable = require('FuseJS/Observable');

var types = Observable([{
    "id": "1",
    "label": "Temperature",
}, {
    "id": "2",
    "label": "Blood Pressure",
}, {
    "id": "3",
    "label": "Heart rate",
}, {
    "id": "4",
    "label": "Pain Level",
}, {
    "id": "5",
    "label": "RX Perscriptions",
}, {
    "id": "6",
    "label": "Send Image",
}, {
    "id": "7",
    "label": "Comparison With Picture",
}, {
    "id": "8",
    "label": "Diet",
}, {
    "id": "9",
    "label": "Activity",
}, {
    "id": "10",
    "label": "Hygiene",
}, {
    "id": "11",
    "label": "Other Instructions",
}, ])

function GetTypeLabel(idType) {
    var ret = "None";
    var allTypes = types.value;

    for (var i = 0; i < allTypes.length; i++) {
        if (allTypes[i].id == idType) {
            ret = allTypes[i].label.toUpperCase();
            return ret;
        }
    }
}

module.exports = {
    types: types,
    GetTypeLabel: GetTypeLabel
};