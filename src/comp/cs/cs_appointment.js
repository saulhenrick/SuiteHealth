/**
 * @NApiVersion 2.x
 * @NScriptType clientscript
 */

define(["../../app/app_appointment_manager"],

function(appointmentManager) {
	
	var TIME = "custrecord_mdm_appt_time";
	var DATE = "custrecord_mdm_appt_date";
	var DOCTOR = "custrecord_mdm_appt_doctor";
	
	function saveRecord(context){
		var currentRecord = context.currentRecord;
		
		var time = currentRecord.getText({
			fieldId: TIME
		});
		
		log.debug("saveRecord", time);
		
		var date = currentRecord.getValue({
			fieldId: DATE
		});
		
		var doctor = currentRecord.getValue({
			fieldId: DOCTOR
		})

		var isValid = appointmentManager.validateAppointment(doctor, time, date);
		
		if(!isValid) {
			alert("Doctor is not available at the schedule you chose.");
		} else {
			log.debug("isValid", isValid);
			return true;
		}
	}
	
    return {
    	saveRecord: saveRecord
    };
    
});
