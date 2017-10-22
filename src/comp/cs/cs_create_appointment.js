/**
 * @NApiVersion 2.x
 * @NScriptType clientscript
 */

define([],

function() {
	
	var DOCTOR = "custrecord_mdm_appt_doctor";
	
	function pageInit(context) {
		var currentRecord = context.currentRecord;
		currentRecord.setValue({
			fieldId: DOCTOR,
			value: getParameter(DOCTOR)
		});
	}
	
	function getParameterValue(parameter) {
		var query = window.location.search.substring(1);
  		var parameters = query.split("&");
  		
  		for (var i=0; i<parameters.length; i++) {
		  	var pair = vars[i].split("=");
	    	if (pair[0] == parameter) {
	    		return pair[1];
	    	}
		}
	}
   
    return {
        pageInit: pageInit
    };
    
});
