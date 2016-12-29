var Observable = require('FuseJS/Observable');

var letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
var finalDoctors = [];

function sort(contacts) {
    var flag = false;

    for (var i = contacts.length - 1; i >= 0; i--) {
        if (contacts[i].firstName != null && contacts[i].firstName != "undefined") {
            contacts[i].firstLetter = contacts[i].firstName.charAt(0).toUpperCase();
            contacts[i].fullName = contacts[i].firstName + " " + contacts[i].lastName;
            contacts[i].isLetter = 0;
        }
    }
    for (var i = 0; i < letters.length; i++) {
        flag = false;
        var tmp = {
            "firstName": letters[i],
            "isLetter": 1
        }
        finalDoctors.push(tmp);
        for (var j = 0; j < contacts.length; j++) {
            if (contacts[j].firstName != null && contacts[j].firstName != "undefined") {
                if (letters[i] == contacts[j].firstLetter) {
                    finalDoctors.push(contacts[j]);
                    flag = true;
                } else {
                    continue;
                }
            }
        }
        if (flag == false) {
            finalDoctors.pop();
        }
    }

    for (var i = 0; i < finalDoctors.length; i++) {
    }

    console.log("Success", JSON.stringify(dataDoctors));

    return (dataDoctors);
}


function alfaTest(nesto) {
    console.log(nesto);
}


module.exports = {
    alfaTest: alfaTest,
    sort: sort
};
