var Observable = require('FuseJS/Observable');
var contacts = require('Contacts');

var searchString2 = Observable("");

var lista = Observable();
var tmpLista = [];

var isLoading = Observable(true);

contacts.authorize().then(function(status) {
    console.log(status);
    if (status === 'AuthorizationAuthorized') {
        // console.log(JSON.stringify(contacts.getAll()));
        var tmp = contacts.getAll();

        tmpLista = [];

        for (var i = 0; i < tmp.length; i++) {
            if (tmp[i].phone != null) {
                var obj = {};
                obj.tel = tmp[i].phone[0].phone;
                var names = tmp[i].name.split(" ");
                obj.fname = names[0];
                var lname = "";
                obj.lname = names[1];
               // console.log(JSON.stringify(obj));
                tmpLista.push(obj);
            }
        }
        isLoading.value = false;
        lista.replaceAll(tmpLista);
    } else {
        router.goBack();
    }
});

function importContact(e) {

    var contact = {};
    contact.name = e.data.fname;
    contact.surname = e.data.lname;
    contact.phoneNumber = e.data.tel;

    router.push("addDoctor", {
        localContact: contact
    });

}


function stringContainsString(main, filter) {
    return main.toLowerCase().indexOf(filter.toLowerCase()) != -1;
}

var filteredItems = searchString2.flatMap(function(searchValue) {
    return lista.where(function(item) {
        return stringContainsString(item.fname, searchValue);
    });
});



module.exports = {

    filteredItems: filteredItems,
    importContact: importContact,
    searchString2: searchString2,
    isLoading: isLoading
};