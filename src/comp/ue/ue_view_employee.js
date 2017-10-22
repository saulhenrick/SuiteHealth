/**
 * @NApiVersion 2.x
 * @NScriptType usereventscript
 */

define([],

function() {
	
	var SET_APPT_BUTTON_LABEL = "Set an Appointment";
	
	function beforeLoad(context) {
		var form = context.form;
		var currRecord = context.newRecord;
		var isDoctor = currRecord.getValue({
			fieldId: "custentity_mdm_emp_isdoctor"
		});
		
		if(isDoctor) {
			var setApptButtonParams = {
	            id: "custpage_set_appointment",
	            label: SET_APPT_BUTTON_LABEL ,
	            functionName: "setAppointment(" + currRecord.id + ");",
	        };
			
			form.addButton(setApptButtonParams);
			form.clientScriptModulePath = "../../comp/cs/cs_employee";
		}
	}
   
    return {
        beforeLoad: beforeLoad
    };
    
});
