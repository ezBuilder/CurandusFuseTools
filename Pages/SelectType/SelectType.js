var Observable = require("FuseJS/Observable")
exports.values = Observable()

exports.list = Observable("")
exports.values.onValueChanged(module, function() {

    exports.list.value = exports.values.toArray().join(",")
    console.log("kako se kreira listata: " + exports.values.toArray().join(","));

    //console.log("lista: "+JSON.stringify(exports.list))

})
console.log("values: " + JSON.stringify(exports.values));