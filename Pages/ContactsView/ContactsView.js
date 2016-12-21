    var Observable = require("FuseJS/Observable");
    var Storage = require("FuseJS/Storage");

    var contactsFromDatabase = Observable();
    var errorMessage = Observable();
    var data = Observable();
    var konechniKontakti = Observable();
    var letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    var group = {
        "letter": "",
        "kontakti": []
    };
    // kontakti[ipId]={"name":"","lastname":""};
    var contacts = [];
    var final = [];
    konechnaKontakti = [];

    var userInfo = Storage.readSync("userInfo");

    var providerId = 1;
    // var providerId = userInfo.providerId;

    // Del koj go pravi grupiranjeto i setira vrednosti za dali - Kontakt ili Tab  ///

    // kod kontakti
    function fetchData() {
        var url = "http://192.168.1.110:8080/curandusproject/webapi/api/getpatientsall/" + providerId
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
        }).then(function(contacts) {

            var flag = false;

            for (var i = contacts.length - 1; i >= 0; i--) {
                contacts[i].firstLetter = contacts[i].firstName.charAt(0);
                contacts[i].fullName = contacts[i].firstName + " " + contacts[i].lastName;
                contacts[i].isLetter = 0;
            }

            for (var i = 0; i < letters.length; i++) {
                flag = false;
                var tmp = {
                    "firstName": letters[i],
                    "isLetter": 1
                }
                final.push(tmp);
                for (var j = 0; j < contacts.length; j++) {
                    if (letters[i] == contacts[j].firstLetter) {
                        final.push(contacts[j]);
                        flag = true;
                    } else {
                        continue;
                    }
                }
                if (flag == false) {
                    final.pop();
                }
            }

            for (var i = 0; i < final.length; i++) {
                data.add(final[i]);
            }

            console.log("Success");
        }).catch(function(err) {
            console.log("Fetch data error");
            console.log(err.message);
        });
    } // end function checkData


    fetchData();

    function goToSelectType(e) {
        router.push("SelectType", {
            user: e.data
        });
    }

    function goToAddContact() {
        router.push("addContact", {});
    }

    module.exports = {
        fetchData: fetchData,
        data: data,
        contacts: contacts,
        errorMessage: errorMessage,
        goToSelectType: goToSelectType,
        goToAddContact: goToAddContact,
        goToChat: goToChat
    };

    function goToChat(e) {
        router.push("chat", {
            user: e.data
        });
    }