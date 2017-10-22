/**
 * @NApiVersion 2.0
 * @NScriptType clientscript
 */

 define(['N/runtime', 'N/log', 'N/currentRecord'],
 
 function(runtime, log, currRecord) {
 
	return {
		
		pageInit : function(context){
			//admin = 3
			var userObj = runtime.getCurrentUser().role;
			var currMode = context.mode;
			var record = currRecord.get();
			log.debug("Role: " + userObj + " Mode: " + currMode);
			
			if (userObj == "1000" && (currMode == 'edit' )){ //doctor role
				var labTestType = record.getField({
					fieldId: 'custrecord_mdm_lab_test_type'
				});
				var labStatus = record.getField({
					fieldId: 'custrecord_mdm_lab_test_status'
				});
				var labDate = record.getField({
					fieldId: 'custrecord_mdm_lab_test_date'
				});
				var labStatusValue = record.getText({
					fieldId: 'custrecord_mdm_lab_test_status'
				});
				
				if (labStatusValue == "Completed"){
					labTestType.isDisabled = true;
					labStatus.isDisabled = true;
					labDate.isDisabled = true;
				}
				else{
					labTestType.isDisabled = true;
					labStatus.isDisabled = true;
					labDate.isDisabled = false;
				}
			}
			if (userObj == "1004" && currMode == 'edit'){ //laboratory technician role
				var labTestType = record.getField({
					fieldId: 'custrecord_mdm_lab_test_type'
				});
				var labStatus = record.getField({
					fieldId: 'custrecord_mdm_lab_test_status'
				});
				var labDate = record.getField({
					fieldId: 'custrecord_mdm_lab_test_date'
				});
				var labStatusValue = record.getText({
					fieldId: 'custrecord_mdm_lab_test_status'
				});
				
				if (labStatusValue == "Completed"){
					labTestType.isDisabled = true;
					labStatus.isDisabled = true;
					labDate.isDisabled = true;
				}
				else{
					labTestType.isDisabled = true;
					labStatus.isDisabled = false;
					labDate.isDisabled = false;
				}
			}
			if (userObj == '3' && currMode == 'edit'){
				log.error("I am admin!!!" + record.id);
/*				var labTestType = record.getField({
					fieldId: 'custrecord_mdm_lab_test_type'
				});
				var labStatus = record.getField({
					fieldId: 'custrecord_mdm_lab_test_status'
				});
				var labDate = record.getField({
					fieldId: 'custrecord_mdm_lab_test_date'
				});
				var labStatusValue = record.getText({
					fieldId: 'custrecord_mdm_lab_test_status'
				});
				
				if (labStatusValue == "Completed"){
					labTestType.isDisabled = true;
					labStatus.isDisabled = true;
					labDate.isDisabled = true;
				}
				else{
					labTestType.isDisabled = true;
					labStatus.isDisabled = false;
					labDate.isDisabled = false;
				}
				*/
			}
		},
	};
 
 });