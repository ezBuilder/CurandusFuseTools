var Observable = require('FuseJS/Observable');
var jsSHA = require('Scripts/sha.js');

// var appId = 44310;
// var accountKey = "ARnU79PpjqYzTGbkAYde";
// var authKey = "4zHnE9UWNMuOyjL";
// var authSecret = "sk5aedSkRkOEkAH";

var appId = 55181;
var accountKey = "BCvs7yU8aBbnCbqzczhx";
var authKey = "qjzpqFp48yXb8At";
var authSecret = "FG-TWkzneUQExsw";

var password = "hsadjkvlhs8FhgasG62h1tlasdnhlsdfk";

function getSignedData(obj) {
    var response = {};
    var str = "";

    for (var key in obj) {
        str += (key + '=' + obj[key] + "&");
        response[key] = obj[key];
    };

    str = str.substring(0, str.length - 1);

    var shaObj = new jsSHA("SHA-1", "TEXT");
    shaObj.setHMACKey(authSecret, "TEXT");
    shaObj.update(str);
    var hmac = shaObj.getHMAC("HEX");

    response.signature = hmac;

    return response;
}

module.exports = {
    appId: appId,
    accountKey: accountKey,
    authKey: authKey,
    getSignedData: getSignedData,
    authSecret: authSecret,
    password: password,
};