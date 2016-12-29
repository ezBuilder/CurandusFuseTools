    var Observable = require("FuseJS/Observable");
    var Storage = require("FuseJS/Storage");

    var contactsFromDatabase = Observable();
    var isDoctors = Observable(false);
    var data = Observable();
    var dataDoctors = Observable();
    var letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

    var final = [];
    var finalDoctors = [];
    konechnaKontakti = [];

    var Alpabet = require("/Alphabet.js");


    function setDoctors() {
        isDoctors.value = true;
    }

    function setPatients() {
        isDoctors.value = false;
    }

    var userInfo = Storage.readSync("userInfo");

    // var providerId = 1; 
    // var providerId = userInfo.providerId;

    function fetchDataDoctors() {
        // ТРЕБА ДА СЕ СМЕНИ
        var urlProvider = "http://192.168.1.165:8081/curandusproject/webapi/api/getprovidersdatabyprovider/1"
        console.log(urlProvider);
        fetch(urlProvider, {
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
            var tmp = Alpabet.sort(contacts);
            for (var i = 0; i < tmp.length; i++) {
                dataDoctors.add(tmp[i]);
            }
            console.log("msg", JSON.stringify(dataDoctors));

        }).catch(function(err) {
            console.log("Fetch data error");
            console.log(err.message);
        });
    }
    // kod kontakti
    function fetchData() {
        // ТРЕБА ДА СЕ СМЕНИ
        var urlPatient = "http://192.168.1.165:8081/curandusproject/webapi/api/patients/providerId=3"
        console.log(urlPatient);
        fetch(urlPatient, {
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
                contacts[i].firstLetter = contacts[i].firstName.charAt(0).toUpperCase();
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

            console.log("Success222222222222", JSON.stringify(data));
        }).catch(function(err) {
            console.log("Fetch data error");
            console.log(err.message);
        });
    } // end function checkData

    fetchData();
    fetchDataDoctors();

    function goToSelectType(e) {
        router.push("SelectType", {
            user: e.data
        });
    }

    function goToAddContact() {
        router.push("addContact", {});
    }

    function goToAddDoctors() {
        router.push("addDoctor", {});
    }

    module.exports = {
        fetchData: fetchData,
        data: data,
        dataDoctors: dataDoctors,
        isDoctors: isDoctors,
        goToSelectType: goToSelectType,
        goToAddContact: goToAddContact,
        goToAddDoctors: goToAddDoctors,
        setDoctors: setDoctors,
        setPatients: setPatients,
        goToChat: goToChat
    };

    function goToChat(e) {
        router.push("chat", {
            user: e.data
        });
    }