/**
 * @NModuleScope Public
 */
define(["N/search"],

function(search) {
	
	var CLINIC_HOURS = "customrecord_mdm_clinic_hours";
	var DOCTOR = "custrecord_mdm_clinic_hours_doctor";
	var DAY_OF_WEEK = "custrecord_mdm_clinic_hours_day";
	var START_TIME = "custrecord_mdm_clinic_hours_time";
	var END_TIME = "custrecord_mdm_clinic_hours_end_time";
	
	function validateAppointment(doctorId, time, date) {
		var day = date.getDay();
		if(day == 0) day = 7;
		
		log.debug("time", time);
		log.debug("date", date);
		log.debug("doctorId", doctorId);
		log.debug("day", day);
		
		var clinicHoursSearch = search.create({
			type: CLINIC_HOURS,
			filters: [
				search.createFilter({
					name: DOCTOR,
					operator: search.Operator.IS,
					values: doctorId
				}),
				search.createFilter({
					name: DAY_OF_WEEK,
					operator: search.Operator.ANYOF,
					values: [day]
				}),
				search.createFilter({
					name: START_TIME,
					operator: "lessthanorequalto",
					values: time
				}),
				search.createFilter({
					name: END_TIME,
					operator: "greaterthan",
					values: time
				})
			],
			columns: ["internalid"]
		});
		
		var valid = false;
		clinicHoursSearch.run().each(function(result) {
		    valid = true;
		});
		
		return valid;
	}
   
    return {
    	validateAppointment: validateAppointment
    };
    
});
