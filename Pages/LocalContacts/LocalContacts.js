var Observable = require('FuseJS/Observable');

var searchString2 = Observable("");

var lista= Observable ();

var tmp = [{
    "id": 1,
    "fname": "Kimberly",
    "lname": "Breiter",
    "tel": "(719)171-1820"
}, {
    "id": 2,
    "fname": "Azra",
    "lname": "Kraenzle",
    "tel": "(801)570-8484"
}, {
    "id": 3,
    "fname": "Rebecca",
    "lname": "Nutter",
    "tel": "(551)843-5069"
}, {
    "id": 4,
    "fname": "Michelamone",
    "lname": "Heppelmann",
    "tel": "(648)188-0642"
}, {
    "id": 5,
    "fname": "Katina",
    "lname": "Ha",
    "tel": "(455)418-0752"
}, {
    "id": 6,
    "fname": "Marilynn",
    "lname": "Fowler",
    "tel": "(377)480-3941"
}, {
    "id": 7,
    "fname": "Earl",
    "lname": "Denard",
    "tel": "(111)129-4832"
}, {
    "id": 8,
    "fname": "Artina",
    "lname": "Lewis",
    "tel": "(761)252-5413"
}, {
    "id": 9,
    "fname": "Clint",
    "lname": "Chatham",
    "tel": "(469)488-2168"
}, {
    "id": 10,
    "fname": "Yiping",
    "lname": "Loban",
    "tel": "(605)221-5484"
}];


for (var i = tmp.length - 1; i >= 0; i--) {
	lista.add(tmp[i]);
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
    searchString2: searchString2
};