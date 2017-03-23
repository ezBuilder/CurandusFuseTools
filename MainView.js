		var Observable = require("FuseJS/Observable");
		var url = require("Constants/SERVICE_URL.js");
		var Storage = require("FuseJS/Storage");
		var myToast = require("myToast");
		var QConfig = require('Scripts/quickbloxConfig.js');
		var imagePath = Observable();
		var flag = Observable("no_picture"); 
		var activeUrl = require("Constants/SERVICE_URL.js");
		imagePath.value = activeUrl.URL+"\/curandusImages"+"\/"+"Assets"+"\/"+"placeholder.png";
		var msg = "Welcome to Curandus";
		myToast.toastIt(msg)

		var User;
		var name = Observable();
		var surname = Observable();

		Storage.read("userInfo").then(function(content) {
		    User = JSON.parse(content);
		    name.value = User.firstName;
		    surname.value = User.lastName;
		}, function(error) {

		});

		Storage.read("userInfoBrojslika").then(function(content) { 
        flag.value="storage";
            console.log("On onParameterChanged vo Mainview page: "+content);
            imagePath.value=content;
        }, function(error) { 
        	flag.value="no_picture";
        	imagePath.value="../../Assets/placeholder.png";
            console.log("nema slika vo storage!"); 
    	}); 



		function goToAbout() {
		    router.push("AboutPage", {});
		    EdgeNavigator.dismiss();
		}

		function goToShare() {
		    router.push("SharePage", {});
		    EdgeNavigator.dismiss();
		}

		function goToEdit() {

			var tmp = Math.random();
		    router.push("EditProfile", {tmp});
		    EdgeNavigator.dismiss();
		}

		function OpenMenu() {
			Storage.read("userInfoBrojslika").then(function(content) { 
	        flag.value="storage";
	            console.log("On onParameterChanged vo Mainview page: "+content);
	            imagePath.value=content;
	        }, function(error) { 
	        	flag.value="no_picture";
	        	imagePath.value="../../Assets/placeholder.png";
	            console.log("nema slika vo storage!"); 
	    	}); 
			    EdgeNavigator.open("Left");
			}


		function closeSideMenu() {
		    EdgeNavigator.dismiss();
		}


function deleteStorage() {
    console.log("delete storage povikana 1");
    var success = Storage.deleteSync("userInfo");
    console.log("delete storage povikana 2");
    Storage.write("userInfoBrojslika", activeUrl.URL+"\/curandusImages"+"\/"+"Assets"+"\/"+"placeholder.png"); 
    console.log("delete storage povikana 3");
    if (success) {
        console.log("Deleted file");
    } else {
        console.log("An error occured!");
    }
}


		module.exports = {
		    goToAbout: goToAbout,
		    goToEdit: goToEdit,
		    goToShare: goToShare,
		    name: name,
		    surname: surname,
		    OpenMenu: OpenMenu,
		    closeSideMenu: closeSideMenu,
		    imagePath:imagePath,
		    flag:flag,
		    deleteStorage:deleteStorage
		};