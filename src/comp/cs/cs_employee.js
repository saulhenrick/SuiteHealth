/**
 * @NApiVersion 2.x
 * @NScriptType clientscript
 */

define(["N/url"],

function(url) {
	
	var APPOINTMENT = "customrecord_mdm_doctor_appointment";
   
	function setAppointment(doctorId) {
		var appointmentUrl = url.resolveRecord({
		    recordType: APPOINTMENT,
		    recordId: "",
		    params: {
		    	"custrecord_mdm_appt_doctor": doctorId
		    }
		});
		
		window.location.href = appointmentUrl;
	}
	
	function pageInit() {
		
	}
	
    return {
    	setAppointment: setAppointment,
    	pageInit: pageInit
    };
    
});
