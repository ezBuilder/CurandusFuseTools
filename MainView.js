		var Observable = require("FuseJS/Observable");
		var url = require("Constants/SERVICE_URL.js");
		var Storage = require("FuseJS/Storage");
		var myToast = require("myToast");
		var QConfig = require('Scripts/quickbloxConfig.js');

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



		function goToAbout() {
		    router.push("AboutPage", {});
		    EdgeNavigator.dismiss();
		}

		function goToShare() {
		    router.push("SharePage", {});
		    EdgeNavigator.dismiss();
		}

		function goToEdit() {
		    router.push("EditProfile", {});
		    EdgeNavigator.dismiss();
		}

		function OpenMenu() {
		    EdgeNavigator.open("Left");
		}


		function closeSideMenu() {
		    EdgeNavigator.dismiss();
		}

		module.exports = {
		    goToAbout: goToAbout,
		    goToEdit: goToEdit,
		    goToShare: goToShare,
		    name: name,
		    surname: surname,
		    OpenMenu: OpenMenu,
		    closeSideMenu: closeSideMenu
		};