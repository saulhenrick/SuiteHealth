/**
 * @NApiVersion 2.x
 * @NScriptType usereventscript
 */

define(["N/ui/serverWidget", "N/runtime"],
    
    function(serverWidget, runtime) {
        function beforeLoad(context) {
            var form = context.form;
            var currRecord = context.newRecord;

            if (context.type === context.UserEventType.EDIT) {
                
                var disableFields = [];
                var currentUser = runtime.getCurrentUser();
                if (currentUser.roleId == "customrole_mdm_secretary") {

                    disableFields = [
                        'custrecord_mdm_appt_patient',
                        'custrecord_mdm_appt_doctor',
                        'custrecord_mdm_appt_time',
                        'custrecord_mdm_appt_date',
                        'custrecord_mdm_appt_notes_patient',
                        'custrecord_appointment_health_credit',
                        'custrecord_appointment_awarded_hp'
                    ];

                } else if (currentUser.roleId != "customrole_mdm_doctor") {

                    disableFields = [
                        'custrecord_mdm_appt_status',
                        'custrecord_mdm_appt_rejection_status'
                    ];

                }

                for (var i = 0; i < disableFields.length; i++) {
                    var field = form.getField({
                        id: disableFields[i]
                    });
                    field.updateDisplayType({
                        displayType: serverWidget.FieldDisplayType.INLINE
                    });
                }
                
            }

        }
       
        return {
            beforeLoad: beforeLoad
        };
        
    });