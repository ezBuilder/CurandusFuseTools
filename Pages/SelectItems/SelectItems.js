var Observable = require('FuseJS/Observable');
var activeUrl = require("Constants/SERVICE_URL.js");
var Storage = require("FuseJS/Storage");
var Modal = require('Modal');
var myToast = require("myToast");
var CameraRoll = require("FuseJS/CameraRoll");
var Camera = require("FuseJS/Camera");
var ImageTools = require("FuseJS/ImageTools");

var lista = Observable();
var P_ActiveTreatmentID;
var P_SubTreatmentID;
var api_call;
var P_PatientID;
var p_enabled = Observable(true);
var user_patient = Observable();
var WarningInfo = Observable();
var praznoime = "";
var show_string = "";
var Types = require("Constants/Types.js");
var flag = Observable();
flag.value = "nemaslika";

var lista_send = [];

var p_patientID = JSON.parse(Storage.readSync("patientId"));


var userInfo = JSON.parse(Storage.readSync("userInfo")); //Storage.readSync("userInfo");
console.log("OVA E user info  yyyy: " + userInfo);
var providerId = JSON.stringify(userInfo.providerId);

var stname = Observable();

var lista_post =
    [];

function NVL(x) {
    if (x == null) {
        return "";
    } else {
        return x;
    }
}

function NewItem(data) {
    this.index = Observable(data.index);
    this.treatmentitemid = Observable(data.treatmentItemId);
    this.subtreatmentdetail = Observable(data.subtreatmentid);
    this.name = Observable(data.name);
    this.label = Observable(data.label);
    this.typet = Observable(data.typeT);
    this.interval = Observable(data.repeatT);
    this.duration = Observable(data.duration);
    this.defaultvalue = Observable(data.render.defaultvalue);
    this.painlevelof = Observable(data.render.painlevelof);
    this.sendimageof = Observable(data.render.sendimageof);
    this.medicinename = Observable(data.render.medicinename);
    this.medicinecomment = Observable(data.render.medicinecomment);
    this.diet = Observable(data.render.diet);
    this.activity = Observable(data.render.activity);
    this.hygiene = Observable(data.render.hygiene);
    this.otherinstruction = Observable(data.render.otherinstruction);
    this.comparisionquestion = Observable(data.render.comparisionquestion);
    //this.comparisioncomment = Observable(data.render.comparisioncomment);
    this.comparisionurl = Observable(data.render.comparisionurl);
    this.flag = Observable(data.flag);
}

this.onParameterChanged(function(param) {

    P_ActiveTreatmentID = 0;
    P_SubTreatmentID = 0;
    P_PatientID = 0;
    stname.value = "";
    console.log("param senddata" + JSON.stringify(param.sendData));

    console.log("P_SubTreatmentID" + param.sendData[param.sendData.length - 1].SubtreatmentIdOnEDIT);

    console.log("Patientn " + param.sendData[param.sendData.length - 3].patientId);

    lista.clear();
    var responseObject = JSON.stringify(param.sendData);

    for (var i = 0; i < param.sendData.length - 3; i++) {
        //	param.sendData[i].name=param.sendData[i].name.replace(" ","");
        //	param.sendData[i].name=param.sendData[i].name.replace(" ","");
        //  console.log("Ime Tip  "+ Types.GetTypeLabel("1"));
        console.log("ID  " + param.sendData[i].name);

        param.sendData[i].label = Types.GetTypeLabel(param.sendData[i].name);

        console.log("Ime Tip  " + param.sendData[i].label);
        //console.log("TIPOVI", JSON.stringify(Types.types.value)); 
        if (param.sendData[i].renderingInfo == null || param.sendData[i].renderingInfo == "null") {
            param.sendData[i].render = "";
        } else {
            param.sendData[i].render = JSON.parse(JSON.parse(param.sendData[i].renderingInfo));
        }

        //	console.log("Render "+(JSON.parse(param.sendData[i].render)).diet);    
        param.sendData[i].index = i;
        lista.add(new NewItem(param.sendData[i]));
    }

    p_patient_id = param.sendData[param.sendData.length - 3].patientId;
    P_SubTreatmentID = param.sendData[param.sendData.length - 1].SubtreatmentIdOnEDIT;

    if (P_SubTreatmentID == "") {
        P_SubTreatmentID = 0;
    }


    stname.value = param.sendData[param.sendData.length - 2].templateName;

    prazno_ime = param.sendData[param.sendData.length - 2].templateName;

    if (param.sendData[param.sendData.length - 2].templateName == "") {
        console.log("44444");
    }

    console.log("Nameeee " + param.sendData[param.sendData.length]);
    console.log("Prametar " + p_patient_id + " P_SubTreatmentID " + P_SubTreatmentID + " Name " + stname.value);
    //   stname.value="";

    var url = activeUrl.URL + "/curandusproject/webapi/api/getPatientsData/patientId=" + p_patient_id;
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
    }).then(function(data) {
        user_patient.value = data;

        if (NVL(user_patient.value.allergies) != "" || NVL(user_patient.value.chronicDiseases) != "" || NVL(user_patient.value.medicationsThatRecieves) != "") {
            WarningInfo.value = "Warning";

            console.log("warning " + WarningInfo.value);
        } else {
            WarningInfo.value = "";
            console.log("nema warning " + WarningInfo.value);
        }

    }).catch(function(err) {
        console.log("Fetch data error");
        console.log(err.message);
    });


});

function selectImage(sender) {
    console.log("data" + sender.data.index.value);
    lista.getAt(sender.data.index.value).flag.value = "load";
    console.log("Vleguva vo selectimage: ");
    //console.log("ova e patekata na slikata:"+ImageURL.value);     
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

                            var rendering = {
                                "base64": image
                            };
                            //console.log("The base64 encoded image is "+rendering);
                            var tmp = {
                                "name": "ComparisonWithPicture",
                                "duration": "3",
                                "status": "1",
                                "createdBy": 0,
                                "modifiedBy": 0,
                                "created": null,
                                "modified": null,
                                "typeT": "ACK",
                                "renderingInfo": JSON.stringify(rendering),
                                "repeatT": "5",
                                "subtreatmentid": 18
                            };
                            console.log("The tmp is " + tmp);

                            fetch(activeUrl.URL + "/curandusproject/webapi/api/inserttreatmentitemimage", {
                                method: 'POST',
                                headers: {
                                    "Content-type": "application/json"
                                },
                                dataType: 'json',
                                body: JSON.stringify(tmp)
                            }).then(function(response) {
                                status = response.status; // Get the HTTP status code
                                response_ok = response.ok; // Is response.status in the 200-range?
                                return response.json(); // This returns a promise
                            }).then(function(responseObject) {
                                console.log("Success");
                                console.log("broj na slika: " + responseObject);
                                //  ImageURL.value = "http://192.168.1.110:8080/curandusImages/"+responseObject+".jpg";
                                lista.getAt(sender.data.index.value).comparisionurl.value = activeUrl.URL + "/curandusImages/" + responseObject + ".jpg";

                                console.log("URL " + lista.getAt(sender.data.index.value).comparisionurl.value);
                            }).catch(function(err) {
                                console.log("Error", err.message);
                            });
                        });

                    // displayImage(image);
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

function takePicture(sender) {
    Camera.takePicture().then(
        function(image) {
            console.log("Vleze vo takepicture: " + image);
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

                            var rendering = {
                                "base64": image
                            };
                            //console.log("The base64 encoded image is "+rendering);
                            var tmp = {
                                "name": "ComparisonWithPicture",
                                "duration": "3",
                                "status": "1",
                                "createdBy": 0,
                                "modifiedBy": 0,
                                "created": null,
                                "modified": null,
                                "typeT": "ACK",
                                "renderingInfo": JSON.stringify(rendering),
                                "repeatT": "5",
                                "subtreatmentid": 18
                            };
                            console.log("The tmp is " + tmp);

                            fetch(activeUrl.URL + "/curandusproject/webapi/api/inserttreatmentitemimage", {
                                method: 'POST',
                                headers: {
                                    "Content-type": "application/json"
                                },
                                dataType: 'json',
                                body: JSON.stringify(tmp)
                            }).then(function(response) {
                                status = response.status; // Get the HTTP status code
                                response_ok = response.ok; // Is response.status in the 200-range?
                                return response.json(); // This returns a promise
                            }).then(function(responseObject) {
                                console.log("Success");
                                console.log("broj na slika: " + responseObject);
                                //  ImageURL.value = "http://192.168.1.110:8080/curandusImages/"+responseObject+".jpg";
                                lista.getAt(sender.data.index.value).comparisionurl.value = activeUrl.URL + "/curandusImages/" + responseObject + ".jpg";

                                console.log("URL " + lista.getAt(sender.data.index.value).comparisionurl.value);
                            }).catch(function(err) {
                                console.log("Error", err.message);
                            });
                        });

                    // displayImage(image);
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

function ShowAlergies() {
    Modal.showModal(
        "Patient Info ",
        "Alergies: " + NVL(user_patient.value.allergies) + "\n" +
        "Chronic diseases: " + NVL(user_patient.value.chronicDiseases) + "\n" +
        "Medications that recieves: " + NVL(user_patient.value.medicationsThatRecieves) + "\n", ["OK"],
        function(s) {});
}

function goToSavedTreatments() {
    lista_send = [];

    console.log("Redirekting");
    var url = activeUrl.URL + "/curandusproject/webapi/api/getsavedtreatmenttemplatebyprovider/" + providerId
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
    }).then(function(data) {
        var tmp = {};
        for (var i = 0; i < data.length; i++) {
            tmp = {
                "savedTreatmentTemplateId": data[i].savedTreatmentTemplateId,
                "nameTreatment": data[i].nameTreatment,
                "created": data[i].created,
                "createdBy": data[i].createdBy,
                "modified": data[i].modified,
                "modifiedBy": data[i].modifiedBy,
                "providerDetail": data[i].providerDetail
            }
            lista_send[i] = tmp;
        }

        router.push("savedTreatment", lista_send);

        //router.goto("savedTreatment", lista_send); 
        // router.goto("WelcomePage", null,"savedTreatment", lista_send); 
        //       router.modify({
        //     how: "Goto",
        //     path: [ "main", {}, "savedTreatment", lista_send ],
        //     transition: "Bypass",
        // });
    }).catch(function(err) {
        console.log("Fetch data error");
        console.log(err.message);
    });
}


function CheckFields() {
    var ret = 0;
    for (var i = 0; i < lista.length; i++) {
        if (lista.getAt(i).name.value != "8" && lista.getAt(i).name.value != "9" &&
            lista.getAt(i).name.value != "10" && lista.getAt(i).name.value != "11")
        // lista.getAt(0).name.value=="TemperatureCheck"||lista.getAt(0).name.value=="PulseCheck"
        // ||lista.getAt(0).name.value=="BloodPressuerCheck")  
        {
            if (NVL(lista.getAt(i).interval.value) == "" || NVL(lista.getAt(i).duration.value) == "") {
                console.log("Interval " + lista.getAt(i).interval.value);
                ret = ret + 1;
            }
        } else if (lista.getAt(i).name.value == "8") {
            if (NVL(lista.getAt(i).diet.value) == "" || NVL(lista.getAt(i).duration.value) == "") {

                console.log("diet");
                console.log("Interval " + NVL(lista.getAt(i).duration.value));
                ret = ret + 1;
            }
        } else if (lista.getAt(0).name.value == "10") {
            if (NVL(lista.getAt(i).hygiene.value) == "" || NVL(lista.getAt(i).duration.value) == "") {
                ret = ret + 1;
            }
        } else if (lista.getAt(i).name.value == "11") {
            if (NVL(lista.getAt(i).otherinstructions.value) == "" || NVL(lista.getAt(i).duration.value) == "") {
                ret = ret + 1;
            }
        } else if (lista.getAt(i).name.value == "9") {
            if (NVL(lista.getAt(i).activity.value) == "" || NVL(lista.getAt(i).duration.value) == "") {
                ret = ret + 1;
            }
        }


        if (lista.getAt(i).name.value == "4") {
            if (NVL(lista.getAt(i).painlevelof.value) == "") {
                ret = ret + 1;
            }
        } else if (lista.getAt(i).name.value == "6") {
            if (NVL(lista.getAt(i).sendimageof.value) == "") {
                ret = ret + 1;
            }
        } else if (lista.getAt(i).name.value == "7") {
            if (NVL(lista.getAt(i).comparisionquestion.value) == "" || NVL(lista.getAt(i).comparisionurl.value) == "") {
                ret = ret + 1;
            }
        } else if (lista.getAt(i).name.value == "5") {
            if (NVL(lista.getAt(i).medicinename.value) == "" || NVL(lista.getAt(i).medicinecomment.value) == "") {
                ret = ret + 1;
            }
        }
    }

    console.log("ret " + ret);
    if (ret == 0) {
        p_enabled.value = true;
        return true;
    } else {
        p_enabled.value = false;
        return false;
    }
}

function ChekNameTreatment() {
    console.log("klik");

    var pom = CheckFields();
    console.log("pom " + pom);

    // Modal.showModal(
    //     "Skip " + "TEST",
    //     "Are you sure you want to ovveride this treatment?", ["Yes", "No"],
    //     function(s) {
    //         debug_log("Got callback with " + s);
    //         if (s == "Yes") {
    //             console.log("Clicked item - TEST");
    //         }
    //         else
    //         {
    //         	console.log("Clicked item - TEST");
    //         }
    //     });
}

function AddNewItem(sender) {
    console.log("subtreatmentdetail" + sender.data.subtreatmentdetail.value);

    console.log("index" + sender.data.index);
    var pom_item = {
        "name": sender.data.name.value,
        "label": sender.data.label.value,
        "subtreatmentid": sender.data.subtreatmentdetail.value,
        "index": sender.data.index.value + 1,
        "render": ""
    }
    lista.insertAt(sender.data.index.value + 1, new NewItem(pom_item));
    for (var i = 0; i < lista.length; i++) {
        lista.getAt(i).index.value = i;
    }
}

function RemoveItem(sender) {
    lista.remove(sender.data);
    for (var i = 0; i < lista.length; i++) {
        lista.getAt(i).index.value = i;
    }
}

function Insert_Treatment() {
    lista_post = [];

    var validation = CheckFields();

    if (validation == false) {
        // Modal.showModal(
        //    "Message",
        //    "Please fulfill all fields in treatment", ["OK"],
        //    function(s) {
        //    });

        myToast.toastIt("Please fulfill all fields in treatment")

    } else {
        var rendering;
        for (var i = 0; i < lista.length; i++) {
            rendering = {};
            if (lista.getAt(i).name.value == "4") {
                rendering = {
                    "painlevelof": lista.getAt(i).painlevelof.value
                };
            } else if (lista.getAt(i).name.value == "5") {
                rendering = {
                    "medicinename": lista.getAt(i).medicinename.value,
                    "medicinecomment": lista.getAt(i).medicinecomment.value
                };
            } else if (lista.getAt(i).name.value == "6") {
                rendering = {
                    "sendimageof": lista.getAt(i).sendimageof.value
                };
            } else if (lista.getAt(i).name.value == "8") {
                rendering = {
                    "diet": lista.getAt(i).diet.value
                };
            } else if (lista.getAt(i).name.value == "10") {
                rendering = {
                    "hygiene": lista.getAt(i).hygiene.value
                };
            } else if (lista.getAt(i).name.value == "9") {
                rendering = {
                    "activity": lista.getAt(i).activity.value
                };
            } else if (lista.getAt(i).name.value == "11") {
                rendering = {
                    "otherinstruction": lista.getAt(i).otherinstruction.value
                };
            } else if (lista.getAt(i).name.value == "7") {
                rendering = {
                    "comparisionquestion": lista.getAt(i).comparisionquestion.value,
                    "comparisionurl": lista.getAt(i).comparisionurl.value
                };
            }

            var pom = {
                "treatmentItemId": lista.getAt(i).treatmentitemid.value,
                "name": lista.getAt(i).name.value,
                "typeT": "ACK",
                "repeatT": lista.getAt(i).interval.value,
                "duration": lista.getAt(i).duration.value,
                "renderingInfo": JSON.stringify(rendering)
            }

            lista_post.push(pom);
            console.log(JSON.stringify(lista_post));

        }
        if (P_SubTreatmentID == 0 || prazno_ime != "") {
            api_call = activeUrl.URL + "/curandusproject/webapi/api/InsertActiveSubTreatment/activetreatmentid=0&providerid=" + providerId + "&patientid=" + p_patient_id + "&nametreatment=Prv&namesubtreatment=PrvS";
            show_string = "Treatment assigned to patient";
        } else {
            api_call = activeUrl.URL + "/curandusproject/webapi/api/UpdateActiveSubTreatment/subtreatmentid=" + P_SubTreatmentID;
            show_string = "Treatmetnt updated";
        }

        console.log("api_call " + api_call);


        fetch(api_call, {
            method: 'POST',
            headers: {
                "Content-type": "application/json"
            },
            dataType: 'json',
            body: JSON.stringify(lista_post)
        }).then(function(response) {
            status = response.status; // Get the HTTP status code
            console.log('status', status);
            response_ok = response.ok; // Is response.status in the 200-range?
            return response.json(); // This returns a promise

        }).then(function(responseObject) {
            console.log("Success");

            console.log("parameter " + responseObject);
            var activetreatmentid = responseObject;

            // Modal.showModal(
            //     "Send Treatment ",
            //     show_string, ["OK"],
            //     function(s) {
            //         console.log("Param return " + JSON.stringify(responseObject));
            //         responseObject.num = Math.random();
            //         router.goto("main", {
            //             user: responseObject
            //         });
            //         // router.push("alert", activetreatmentid);
            //     });

            myToast.toastIt(show_string);
            responseObject.num = Math.random();
            router.goto("main", {
                user: responseObject
            });
        }).catch(function(err) {
            console.log("Error", err.message);
        });
    }
}

function Insert_Saved_Treatment() {

    lista_post = [];

    console.log("Insert Save");

    var validation = CheckFields();

    if (validation == false || NVL(stname.value) == "") {
        console.log("pppp  " + providerId);
        // Modal.showModal(
        //     "Message",
        //     "Please fulfill all fields in treatment", ["OK"],
        //     function(s) {});
        myToast.toastIt("Please fulfill all fields in treatment");
    } else {
        var rendering;
        for (var i = 0; i < lista.length; i++) {
            rendering = {};
            if (lista.getAt(i).name.value == "4") {
                rendering = {
                    "painlevelof": lista.getAt(i).painlevelof.value
                };
            } else if (lista.getAt(i).name.value == "5") {
                rendering = {
                    "medicinename": lista.getAt(i).medicinename.value,
                    "medicinecomment": lista.getAt(i).medicinecomment.value
                };
            } else if (lista.getAt(i).name.value == "6") {
                rendering = {
                    "sendimageof": lista.getAt(i).sendimageof.value
                };
            } else if (lista.getAt(i).name.value == "8") {
                rendering = {
                    "diet": lista.getAt(i).diet.value
                };
            } else if (lista.getAt(i).name.value == "10") {
                rendering = {
                    "hygiene": lista.getAt(i).hygiene.value
                };
            } else if (lista.getAt(i).name.value == "9") {
                rendering = {
                    "activity": lista.getAt(i).activity.value
                };
            } else if (lista.getAt(i).name.value == "11") {
                rendering = {
                    "otherinstruction": lista.getAt(i).otherinstruction.value
                };
            } else if (lista.getAt(i).name.value == "7") {
                rendering = {
                    "comparisionquestion": lista.getAt(i).comparisionquestion.value,
                    "comparisionurl": lista.getAt(i).comparisionurl.value
                };
            }

            var pom = {
                "name": lista.getAt(i).name.value,
                "typeT": "ACK",
                "repeatT": lista.getAt(i).interval.value,
                "duration": lista.getAt(i).duration.value,
                "renderingInfo": JSON.stringify(rendering)
            }

            lista_post.push(pom);
        }
        // if (P_SubTreatmentID==0){
        // 	api_call="http://192.168.1.110:8080/curobjectandusproject/webapi/api/InsertActiveSubTreatment/activetreatmentid=0&providerid=2&patientid=1&nametreatment=Prv&namesubtreatment=PrvS";
        // }
        // else{
        // 	api_call="http://192.168.1.110:8080/curandusproject/webapi/api/UpdateActiveSubTreatment";
        // }
        var userInfo = Storage.readSync("userInfo");

        var call_api = activeUrl.URL + "/curandusproject/webapi/api/insertsavedtreatment?providerid=" + providerId + "&nametreatment=" + encodeURIComponent(stname.value);

        console.log("nametreatment " + stname.value);

        console.log("nametreatment " + call_api);

        console.log("lista " + lista_post);

        console.log("lista " + JSON.stringify(lista_post));


        fetch(call_api, {
            method: 'POST',
            headers: {
                "Content-type": "application/json"
            },
            dataType: 'json',
            body: JSON.stringify(lista_post)
        }).then(function(response) {
            status = response.status; // Get the HTTP status code
            console.log('status', status);
            response_ok = response.ok; // Is response.status in the 200-range?
            return response.json(); // This returns a promise

        }).then(function(responseObject) {
            if (responseObject == 0) {
                console.log("Success");
                // Modal.showModal(
                //     "Save Treatment Template",
                //     "You save treatment succesfully", ["OK"],
                //     function(s) {
                //         goToSavedTreatments();
                //     });

                myToast.toastIt("Treatment saved");
                goToSavedTreatments();
            } else {
                console.log("klik");
                Modal.showModal(
                    "Save Treatment Template",
                    "Are you sure you want to overide this treatment?", ["Yes", "No"],
                    function(s) {
                        debug_log("Got callback with " + s);
                        if (s == "Yes") {
                            fetch(activeUrl.URL + "/curandusproject/webapi/api/updatesavedtreatment/savedtreatmentid=" + responseObject, {
                                method: 'POST',
                                headers: {
                                    "Content-type": "application/json"
                                },
                                dataType: 'json',
                                body: JSON.stringify(lista_post)
                            }).then(function(response) {
                                status = response.status; // Get the HTTP status code
                                console.log('status', status);
                                response_ok = response.ok; // Is response.status in the 200-range?
                                return response.json(); // This returns a promise

                            }).then(function(responseObject) {
                                console.log("Success");
                                // Modal.showModal(
                                //     "Save Treatment Template",
                                //     "You save treatment succesfully", ["OK"],
                                //     function(s) {
                                //         goToSavedTreatments();
                                //     });
                                myToast.toastIt("Treatment saved");
                                goToSavedTreatments();
                            }).catch(function(err) {
                                console.log("Error", err.message);
                            });
                        }
                    });
            }

        }).catch(function(err) {
            console.log("Error", err.message);
        });
    }
}

module.exports = {
    lista: lista,
    NewItem: NewItem,
    Insert_Treatment: Insert_Treatment,
    lista_post: lista_post,
    AddNewItem: AddNewItem,
    ChekNameTreatment: ChekNameTreatment,
    stname: stname,
    Insert_Saved_Treatment: Insert_Saved_Treatment,
    CheckFields: CheckFields,
    p_enabled: p_enabled,
    goToSavedTreatments: goToSavedTreatments,
    NVL: NVL,
    user_patient: user_patient,
    ShowAlergies: ShowAlergies,
    WarningInfo: WarningInfo,
    flag: flag,
    selectImage: selectImage,
    takePicture: takePicture,
    RemoveItem: RemoveItem
};