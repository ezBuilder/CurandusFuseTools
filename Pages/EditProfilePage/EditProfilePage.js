var Observable = require('FuseJS/Observable');
var activeUrl = require("Constants/SERVICE_URL.js");
var CameraRoll = require("FuseJS/CameraRoll");
var Camera = require("FuseJS/Camera");
var ImageTools = require("FuseJS/ImageTools");
var Storage = require("FuseJS/Storage");

var imagePath = Observable();
var imageName = Observable();
var imageSize = Observable();
var name = Observable();
var surname = Observable();

var User;

Storage.read("userInfo").then(function(content) {
    debug_log(content);
    User = JSON.parse(content);
    name.value = User.firstName;
    surname.value = User.lastName;
}, function(error) {

});

// get this from the user
imagePath.value = "Assets/placeholder.png";

var displayImage = function(image) {
    imagePath.value = image.path;
    imageName.value = image.name;
    imageSize.value = image.width + "x" + image.height;
}

takePicture = function() {
    Camera.takePicture().then(
        function(image) {
            console.log(JSON.stringify(image));
            var args = {
                desiredWidth: 480,
                desiredHeight: 480,
                mode: ImageTools.SCALE_AND_CROP,
                performInPlace: true
            };
            ImageTools.resize(image, args).then(
                function(image) {
                    CameraRoll.publishImage(image);
                    displayImage(image);
                }
            ).catch(
                function(reason) {
                    console.log("Couldn't resize image: " + reason);
                }
            );
        }
    ).catch(
        function(reason) {
            console.log("Couldn't take picture: " + reason);
        }
    );
};

selectImage = function() {
    CameraRoll.getImage().then(
        function(image) {
            var args = {
                desiredWidth: 480,
                desiredHeight: 480,
                mode: ImageTools.SCALE_AND_CROP,
                performInPlace: true
            };
            ImageTools.resize(image, args).then(
                function(image) {
                    console.log(JSON.stringify(image));
                    ImageTools.getImageFromBase64(image).then(
                        function(b64) {
                            console.log("BASE64", b64);
                        }
                    ).then(function(err) {
                        console.log(err);
                    });

                    displayImage(image);
                }
            ).catch(
                function(reason) {
                    console.log("Couldn't resize image: " + reason);
                }
            );
        }
    ).catch(
        function(reason) {
            console.log("Couldn't get image: " + reason);
        }
    );
};

removePicture = function() {
    var tmp = {
        path: "Assets/placeholder.png"
    };

    displayImage(tmp);
}

editProfile = function() {
    // PUT API FOR UPDATE USER INFO

}

save = function() {
    User.firstName = name.value;
    User.lastName = surname.value;
    Storage.write("userInfo", JSON.stringify(User));
    router.goBack();
}


module.exports = {
    selectImage: selectImage,
    imagePath: imagePath,
    imageName: imageName,
    imageSize: imageSize,
    takePicture: takePicture,
    removePicture: removePicture,
    name: name,
    surname: surname,
    save: save,
};