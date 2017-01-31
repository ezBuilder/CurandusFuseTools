var Observable = require('FuseJS/Observable');
var Storage = require("FuseJS/Storage");
var Modal = require('Modal');

	var lista = Observable();
    var	P_ActiveTreatmentID;
    var	P_SubTreatmentID;
    var api_call;
    var	P_PatientID;
    var p_enabled=Observable(true);

    var p_patientID=JSON.parse(Storage.readSync("patientId"));

	var userInfo = Storage.readSync("userInfo");
   	var p_providerId = userInfo.providerId; 

		 var userInfo = JSON.parse(Storage.readSync("userInfo"));//Storage.readSync("userInfo");
		//var providerId = JSON.parse(userInfo.providerId);
		console.log("OVA E user info  yyyy: "+userInfo);
		var providerId=JSON.stringify(userInfo.providerId);  	  

    var stname=Observable();	

		var lista_post=
				[];

function NVL(x){
	if (x==null){
		return "";
	}
	else
	{
		return x;
	}
}				

function NewItem(data){
		this.index=Observable(data.index);
		this.treatmentitemid=Observable(data.treatmentItemId);
		this.subtreatmentdetail=Observable(data.subtreatmentid);
		this.name=Observable(data.name);
		this.typet=Observable(data.typeT);
		this.interval=Observable(data.repeatT);
		this.duration=Observable(data.duration);
		this.defaultvalue=Observable(data.render.defaultvalue);
		this.painlevelof=Observable(data.render.painlevelof);	
		this.sendimageof=Observable(data.render.sendimageof);
		this.medicinename=Observable(data.render.medicinename);
		this.medicinecomment=Observable(data.render.medicinecomment);
		this.diet=Observable(data.render.diet);	
		this.activity=Observable(data.render.activity);	
		this.hygiene=Observable(data.render.hygiene);	
		this.otherinstruction=Observable(data.render.otherinstruction);	
		this.comparisionquestion=Observable(data.render.comparisionquestion);	
		this.comparisionurl=Observable(data.render.comparisionurl);
}	

    this.onParameterChanged(function(param) { 

    	console.log("ssss");

    	P_ActiveTreatmentID=0;
    	P_SubTreatmentID=0;
    	P_PatientID=0;

    	
    	lista.clear();
    	var responseObject=JSON.stringify(param.sendData);

		     for (var i = 0; i < param.sendData.length-1; i++) {
		     //	param.sendData[i].name=param.sendData[i].name.replace(" ","");
		     //	param.sendData[i].name=param.sendData[i].name.replace(" ","");

		    	 if (param.sendData[i].renderingInfo==null||param.sendData[i].renderingInfo=="null"){
		    		param.sendData[i].render="";
		    	}
		    	else{
			        param.sendData[i].render = //JSON.parse
			        (JSON.parse(param.sendData[i].renderingInfo));		    					        
		   		    }
		        param.sendData[i].index=i-1;
		        lista.add(new NewItem(param.sendData[i]));
		    }
		    p_patient_id=param.sendData[param.sendData.length-1];

		    console.log("Prametar "+p_patient_id);
		    stname.value="";
    });

 		function CheckFields() {
 			var ret=0;
 			for (var i=0;i<lista.length;i++){
 				 if (lista.getAt(0).name.value!="Diet"&&lista.getAt(0).name.value!="Hygiene"&&
 				 	lista.getAt(0).name.value!="Activity"&&lista.getAt(0).name.value!="OtherInstructions")
 				 	// lista.getAt(0).name.value=="TemperatureCheck"||lista.getAt(0).name.value=="PulseCheck"
 				 	// ||lista.getAt(0).name.value=="BloodPressuerCheck")  
 				   {    console.log("Duration "+lista.getAt(0).duration.value);
 				   		console.log("Duration "+NVL(lista.getAt(0).duration.value));
		 				if (NVL(lista.getAt(0).interval.value)==""||NVL(lista.getAt(0).duration.value)=="") {
		 					console.log("Interval "+lista.getAt(0).interval.value);
		 					ret=ret+1;
		 				}
		 			}
 				 else if (lista.getAt(0).name.value=="Diet")  {
		 				if (NVL(lista.getAt(0).diet.value)=="") {
		 					ret=ret+1;
		 				}		 				
		 			}	
 				 else if (lista.getAt(0).name.value=="Hygiene")  {
		 				if (NVL(lista.getAt(0).hygiene.value)=="") {
		 					ret=ret+1;
		 				}		 				
		 			}			 				 					 			
 				 else if (lista.getAt(0).name.value=="OtherInstructions")  {
		 				if (NVL(lista.getAt(0).otherinstructions.value)=="") {
		 					ret=ret+1;
		 				}		 				
		 			}
 				 else if (lista.getAt(0).name.value=="Activity")  {
		 				if (NVL(lista.getAt(0).activity.value)=="") {
		 					ret=ret+1;
		 				}		 				
		 			}


 				  if (lista.getAt(0).name.value=="PainLevel")  {
		 				if (NVL(lista.getAt(0).painlevelof.value)=="") {
		 					ret=ret+1;
		 				}
		 			}	
 				  else if (lista.getAt(0).name.value=="SendImage")  {
		 				if (NVL(lista.getAt(0).sendimageof.value)=="") {
		 					ret=ret+1;
		 				}
 				  else if (lista.getAt(0).name.value=="ComparisonWithPicture")  {
		 				if (NVL(lista.getAt(0).EnterQuestion.value)==""||NVL(lista.getAt(0).comparisionurl.value)=="") {
		 					ret=ret+1;
		 				}		 				
		 			}	
 				 else if (lista.getAt(0).name.value=="Medicines")  {
		 				if (NVL(lista.getAt(0).medicinename.value)==""||NVL(lista.getAt(0).medicinecomment.value)=="") {
		 					ret=ret+1;
		 				}		 				
		 			}		
			}  
		}  
		console.log("ret "+ret);
		if (ret==0) { p_enabled.value=true; return true; }
		else {p_enabled.value=false; return false;}
		
	}

		function ChekNameTreatment() {
			console.log("klik");

			var pom=CheckFields();
			console.log("pom "+pom);

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

function GetParameter(){
		console.log("GetParameter");
		lista.clear();
		fetch("http://192.168.1.110:8080/curandusproject/webapi/api/gettreatmentitemssbytreatment/treatmentId=10&typetreatment=7", {
		    method: 'GET',
		    headers: {
		        "Content-type": "application/json"
		    },
		    dataType: 'json'
		}).then(function(response) {
		  //  status = response.status; // Get the HTTP status code
		    //response_ok = response.ok; // Is response.status in the 200-range?
		    return response.json(); // This returns a promise
		}).then(function(responseObject) {
		    console.log("Success");
		    for (var i = 0; i < responseObject.length; i++) {
		    	console.log("renderinginfo "+responseObject[i].renderingInfo);
		    	 if (responseObject[i].renderingInfo==null||responseObject[i].renderingInfo=="null"){
		    		console.log("NULL "+responseObject[i].renderingInfo);
		    		responseObject[i].render="";
		    	}
		    	else{
		    		console.log("NOT NULL  "+responseObject[i].renderingInfo);
			        responseObject[i].render = //JSON.parse
			        (JSON.parse(responseObject[i].renderingInfo));		    					        
		    }
		        responseObject[i].index=i;
		        lista.add(new NewItem(responseObject[i]));
		    }
		}).catch(function(err) {
		    console.log("Error", err.message);
		});
	}
     function AddNewItem(sender) {
       		var pom_item={
       						"name":sender.data.name.value,
       						"subtreatmentid":sender.data.subtreatmentdetail.value,
       						"index":sender.data.index.value+1,
       						"render":""
       					 }
       		lista.insertAt(sender.data.index.value+1,new NewItem(pom_item));
       		for (var i=0;i<lista.length;i++){
       			lista.getAt(i).index.value=i;
       		}
            } 

      function RemoveItem(sender) {
            	lista.remove(sender.data);
	       		for (var i=0;i<lista.length;i++){
	       			lista.getAt(i).index.value=i;
	       		}            	
            }   

 		function Insert_Treatment(){
 			var userInfo = Storage.readSync("userInfo");
 			var p_provider_id=userInfo.providerId;

 			var validation=CheckFields();

 			if (validation==false)
 			{
				    	Modal.showModal(
				        "Message",
				        "Please fulfill all fields in treatment", ["OK"],
				        function(s) {
				        });
 			}
 			else 
 			{
 			var rendering;
			for (var i=0;i<lista.length;i++){
					rendering={};
					if (lista.getAt(i).name.value=="PainLevel")
					{
						 rendering={"painlevelof":lista.getAt(i).painlevelof.value};
					}
					else if (lista.getAt(i).name.value=="Medicine")
					{		
						 rendering={"medicinename":lista.getAt(i).medicinename.value,
									   "medicinecomment":lista.getAt(i).medicinecomment.value};
					}
					else if (lista.getAt(i).name.value=="SendImage")
					{		
						 rendering={"sendimageof":lista.getAt(i).sendimageof.value};
					}					
					else if (lista.getAt(i).name.value=="Diet")
					{		
						 rendering={"diet":lista.getAt(i).diet.value};
					}	
					else if (lista.getAt(i).name.value=="Hygiene")
					{		
						 rendering={"hygiene":lista.getAt(i).hygiene.value};
					}					
					else if (lista.getAt(i).name.value=="Activity")
					{		
						 rendering={"activity":lista.getAt(i).activity.value};
					}	
					else if (lista.getAt(i).name.value=="OtherInstruction")
					{		
						 rendering={"otherinstruction":lista.getAt(i).otherinstruction.value};
					}
					else if (lista.getAt(i).name.value=="ComparisonWithPicture")
					{		
						 rendering={"comparisionquestion":lista.getAt(i).comparisionquestion.value, 
						 	"comparisionurl":lista.getAt(i).comparisionurl.value};
					}

					var pom={
								"name":lista.getAt(i).name.value,
								"typeT":"ACK",
								"repeatT":lista.getAt(i).interval.value,
								"duration":lista.getAt(i).duration.value,
								"renderingInfo":JSON.stringify(rendering)
							}

							lista_post.push(pom);
						}	
			if (P_SubTreatmentID==0){
				api_call="http://192.168.1.110:8080/curandusproject/webapi/api/InsertActiveSubTreatment/activetreatmentid=0&providerid=2&patientid=1&nametreatment=Prv&namesubtreatment=PrvS";
			}
			else{
				api_call="http://192.168.1.110:8080/curandusproject/webapi/api/UpdateActiveSubTreatment";
			}


			fetch("http://192.168.1.110:8080/curandusproject/webapi/api/InsertActiveSubTreatment/activetreatmentid=0&providerid="+providerId+"&patientid="+p_patientID+"&nametreatment=Prv&namesubtreatment=PrvS", {
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

		        console.log("parameter "+responseObject);
		        var activetreatmentid=responseObject;

		        		Modal.showModal(
				        "Send Treatment ",
				        "You have successfuly send treatmetnt to patient", ["OK"],
				        function(s) {
							        router.push("alert", activetreatmentid);
				        });

		    }).catch(function(err) {
		        console.log("Error", err.message);
		    });
		}
		}

 		function Insert_Saved_Treatment(){

 			console.log("Insert Save");

 			var userInfo = Storage.readSync("userInfo");
 			var p_provider_id=userInfo.providerId;

 			var validation=CheckFields();

 			if (validation==false||NVL(stname.value)=="")
 			{
				    	Modal.showModal(
				        "Message",
				        "Please fulfill all fields in treatment", ["OK"],
				        function(s) {
				        });
 			}
 			else  			
 			{	
 			var rendering;
			for (var i=0;i<lista.length;i++){
					rendering={};
					if (lista.getAt(i).name.value=="PainLevel")
					{
						 rendering={"painlevelof":lista.getAt(i).painlevelof.value};
					}
					else if (lista.getAt(i).name.value=="Medicine")
					{		
						 rendering={"medicinename":lista.getAt(i).medicinename.value,
									   "medicinecomment":lista.getAt(i).medicinecomment.value};
					}
					else if (lista.getAt(i).name.value=="SendImage")
					{		
						 rendering={"sendimageof":lista.getAt(i).sendimageof.value};
					}					
					else if (lista.getAt(i).name.value=="Diet")
					{		
						 rendering={"diet":lista.getAt(i).diet.value};
					}	
					else if (lista.getAt(i).name.value=="Hygiene")
					{		
						 rendering={"hygiene":lista.getAt(i).hygiene.value};
					}					
					else if (lista.getAt(i).name.value=="Activity")
					{		
						 rendering={"activity":lista.getAt(i).activity.value};
					}	
					else if (lista.getAt(i).name.value=="OtherInstruction")
					{		
						 rendering={"otherinstruction":lista.getAt(i).otherinstruction.value};
					}
					else if (lista.getAt(i).name.value=="ComparisonWithPicture")
					{		
						 rendering={"comparisionquestion":lista.getAt(i).comparisionquestion.value, 
						 	"comparisionurl":lista.getAt(i).comparisionurl.value};
					}

					var pom={
								"name":lista.getAt(i).name.value,
								"typeT":"ACK",
								"repeatT":lista.getAt(i).interval.value,
								"duration":lista.getAt(i).duration.value,
								"renderingInfo":JSON.stringify(rendering)
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

			console.log("User "+userInfo);
			fetch("http://192.168.1.110:8080/curandusproject/webapi/api/insertsavedtreatment/providerid="+providerId+"&nametreatment="+stname.value, {
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
		    	if (responseObject==0){
		        	console.log("Success");
				    	Modal.showModal(
				        "Save Treatment Template",
				        "You save treatment succesfully", ["OK"],
				        function(s) {
							        router.push("savedTreatment");


				        });
		        }
		        else {
		         		console.log("klik");
				    	Modal.showModal(
				        "Save Treatment Template",
				        "Are you sure you want to overide this treatment?", ["Yes", "No"],
				        function(s) {
				            debug_log("Got callback with " + s);
				            if (s == "Yes") {
												fetch("http://192.168.1.110:8080/curandusproject/webapi/api/updatesavedtreatment/savedtreatmentid="+responseObject, {
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
											        	Modal.showModal(
												        "Save Treatment Template",
												        "You save treatment succesfully", ["OK"],
												        function(s) {
															        router.push("savedTreatment");


				        });
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
	    GetParameter: GetParameter,
	    AddNewItem: AddNewItem,
	    ChekNameTreatment: ChekNameTreatment,
	    stname: stname,
	    Insert_Saved_Treatment: Insert_Saved_Treatment,
	    CheckFields: CheckFields,
	    p_enabled:p_enabled,
	    NVL: NVL,
	    RemoveItem: RemoveItem	};
