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
var base64Code={}; 
var flag = Observable("no_picture"); 


this.onParameterChanged(function(param) { 
   
    Storage.read("userInfo").then(function(content) { 
    debug_log(content);
    User = JSON.parse(content);
    name.value = User.firstName;
    surname.value = User.lastName;
    }, function(error) {

    });
    
    Storage.read("userInfoBrojslika").then(function(content) { 
        flag.value="storage";
            console.log("On onParameterChanged vo Edit Profile page: "+content);
            imagePath.value=content;
        }, function(error) { 
            console.log("nema slika vo storage!"); 
    }); 

});
 


imagePath.value = "Assets/placeholder.png";

var displayImage = function(image) {
    imagePath.value = image.path;
    imageName.value = image.name;
    imageSize.value = image.width + "x" + image.height;
}

// dodadeno od moki samo za prikaz na slika bez da zapishuva vo baza (CAMERA)
function takePictureShow() {
    flag.value = "camera"; 
    Camera.takePicture().then(
        function(image) {
            console.log("Vleze vo takepictureShow: ");
            var args = {
                desiredWidth: 480,
                desiredHeight: 480,
                mode: ImageTools.SCALE_AND_CROP,
                performInPlace: true
            };
            ImageTools.resize(image, args).then(
                function(image) {
                    ImageTools.getBase64FromImage(image)
                        .then(function(image) {

                            base64Code = {
                                "base64": image
                            };
                            //console.log("vleze vo takePictureShow i ova e kodot: "+base64Code.base64.substr(1, 100));
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


// dodadeno od moki samo za prikaz na slika bez da zapishuva vo baza (LOAD)
function selectImageShow(){
         
   flag.value = "load";
   // imagePath.value="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSba28jhaQEIVyA53dkQLz_NKo9As4-KHa22fxaiRqyfv4C2zw_Kw";
    console.log("Vleze vo selectImageShow: ");
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
                    ImageTools.getBase64FromImage(image) 
                        .then(function(image) {

                            base64Code = { 
                                "base64": image 
                            };
                           //console.log("vleze vo selectImageShow i ova e kodot: "+base64Code.base64.substr(1, 100)); 
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
    Storage.write("userInfoBrojslika", "../../Assets/placeholder.png"); 

    flag.value="no_picture";
    var tmp = {
        path: "Assets/placeholder.png"
    };
    

    displayImage(tmp);
}


function updateProfile(brojSlika){


    console.log("User.providerId "+User.providerId);
    console.log("brojSlika "+brojSlika);

    var url = "http://192.168.1.155:8080/curandusproject/webapi/api/updateProviderImageUrl/"+User.providerId+"&&"+brojSlika+"&&"+User.firstName+"&&"+User.lastName
    console.log("updateProvider se povika so broj slika: "+brojSlika+" i userid:"+User.providerId);
            fetch(url, {
                method: 'POST',
                headers: {
                    "Content-type": "application/json"
                },
                dataType: 'json'
            }).then(function(response) {
                status = response.status; // Get the HTTP status code 
                response_ok = response.ok; // Is response.status in the 200-range? 
                return response.json(); // This returns a promise 
            }).then(function(responseObject) {
                console.log("odgovor od update na url: " + responseObject);                 

            }).catch(function(err) {
               // console.log("Error pri update na pole vo baza za editprofileImage", err.message);
                
            });
}

save = function() {
        User.firstName = name.value;
        User.lastName = surname.value;
        if(flag.value == "no_picture"){
            Storage.write("userInfoBrojslika", "http://192.168.1.110:8080"+"\/curandusImages"+"\/"+"Assets"+"\/"+"placeholder.png"); 
            updateProfile(""); 

        }
        else{


                    console.log("THIS IS THE USER: "+JSON.stringify(User));
                   // console.log("ova e base64 na slikata: "+base64Code.base64.substr(1,100));
                    var tmp = {
                         "name":"edit profile",
                        "duration":"3",
                        "status":"1",
                        "createdBy":0,
                        "modifiedBy":0,
                        "created":null,
                        "modified":null,
                        "typeT":"ACK",
                        "renderingInfo":JSON.stringify(base64Code),
                        "repeatT":"5",
                        "subtreatmentid":18
                    };
                   // console.log("The tmp is created " + tmp);
                    var url1 = "http://192.168.1.155:8080/curandusproject/webapi/api/inserttreatmentitemimage";
                    fetch( url1, {
                        method: 'POST',
                        headers: {
                            "Content-type": "application/json"
                        },
                        dataType: 'json',
                        body: JSON.stringify(tmp) 
                    }).then(function(response) { 
                        status = response.status; // Get the HTTP status code
                        console.log('status', status);
                        response_ok = response.ok; // Is response.status in the 200-range?
                        return response.json(); // This returns a promise
                        
                        
                    }).then(function(responseObject) {
                        flag.value="storage";
                        console.log("broj na slika: " + responseObject); 
                       
                       // zapishuvanje vo local storage broj na slika 
                        if(responseObject != 0){
                             imagePath.value = activeUrl.URL+"\/curandusImages"+"\/"+responseObject+".jpg"; 
                            Storage.write("userInfoBrojslika", imagePath.value); 
                            console.log("napraveno save i imagepath.value= "+imagePath.value);
                            
                            Storage.read("userInfoBrojslika").then(function(content) { 
                                console.log("pri save i povlekuvanje od storage imagevalue: "+content); 
                                }, function(error) { 
                                console.log("nema slika vo storage!"); 
                                });
                              updateProfile(responseObject);  
                        }
                        else{
                            console.log("ne pominuva update:");
                        }                   

                }).catch(function(err) {                    
                    console.log("ova vo error", err.message);                              
                });

            }//end else
    //
    Storage.write("userInfo", JSON.stringify(User));
    router.goBack();

}


function deleteStorage() {
    var success = Storage.deleteSync("userInfo");
    if (success) {
        console.log("Deleted file");
    } else {
        console.log("An error occured!");
    }
}


module.exports = {
    selectImageShow: selectImageShow,
    imagePath: imagePath,
    imageName: imageName,
    imageSize: imageSize,
    takePictureShow: takePictureShow,
    removePicture: removePicture,
    name: name,
    surname: surname,
    save: save,
    flag:flag,
    deleteStorage
};