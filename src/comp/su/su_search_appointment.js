/**
 * @NApiVersion 2.x
 * @NScriptType suitelet
 */

define(["N/search", "N/ui/serverWidget", "N/url"], function (search, serverWidget, url) {

    return {
        onRequest: function (context) {
            if (context.request.method === 'GET') {

                var form = serverWidget.createForm({
                    title: "Search Doctors"
                });

                var symptomsField = form.addField({
                    id: "mdm_symptoms",
                    type: serverWidget.FieldType.TEXT,
                    label: "Symptoms"
                });

                var specializationField = form.addField({
                    id: "mdm_specialization",
                    type: serverWidget.FieldType.SELECT,
                    source: "customrecord_mdm_specialization",
                    label: "Specialization"
                });

                var doctorField = form.addField({
                    id: "mdm_doctor",
                    type: serverWidget.FieldType.SELECT,
                    label: "Doctor"
                });
                doctorField.addSelectOption({
                    value: "0",
                    text: " "
                });

                var doctorSearch = search.create({
                    type: "employee",
                    columns: ["internalid", "entityid"],
                    filters: [
                        [
                            "custentity_mdm_emp_isdoctor",
                            search.Operator.IS,
                            "T"
                        ]
                    ]
                });

                doctorSearch.run().each(function (result) {
                    var intId = doctorField.addSelectOption({
                        value: result.getValue('internalid'),
                        text: result.getValue('entityid')
                    });
                    return true;
                })

                var locationField = form.addField({
                    id: "mdm_location",
                    type: serverWidget.FieldType.TEXT,
                    label: "Location"
                });

                form.addSubmitButton({
                    label: "Search"
                });

                context.response.writePage(form);

            } else {

                var list = serverWidget.createList({
                    title: "Available Doctors and Clinic Hours"
                });

                var params = context.request.parameters;
                log.error('params', params);

                var clinicHoursFilter = [];

                if (params.mdm_location) {

                    var hospitalFilter = [];

                    var hospitalSearch = search.create({
                        type: "customrecord_mdm_hospital",
                        columns: ["internalid", "name"],
                        filters: [
                            [
                                "custrecord_hospital_barangay_name",
                                search.Operator.CONTAINS,
                                params.mdm_location.toUpperCase()
                            ],
                            "or",
                            [
                                "custrecord_hospital_municipality_name",
                                search.Operator.CONTAINS,
                                params.mdm_location.toUpperCase()
                            ],
                            "or",
                            [
                                "custrecord_hospital_province_name",
                                search.Operator.CONTAINS,
                                params.mdm_location.toUpperCase()
                            ],
                            "or",
                            [
                                "custrecord_hospital_street_name",
                                search.Operator.CONTAINS,
                                params.mdm_location.toUpperCase()
                            ]
                        ]
                    });

                    hospitalSearch.run().each(function (result) {
                        hospitalFilter.push(result.getValue('internalid'));
                        // log.error('internalid', result.getValue('internalid'));
                        // log.error('name', result.getValue('name'));
                        return true;
                    });

                    if (hospitalFilter.length > 0) {
                        clinicHoursFilter.push([
                            "custrecord_mdm_clinic_hospital",
                            search.Operator.ANYOF,
                            hospitalFilter
                        ]);
                    }

                }

                if (params.mdm_symptoms || params.mdm_doctor || params.mdm_specialization) {

                    var doctorResults = [];
                    var doctorFilter = [[
                        "custentity_mdm_emp_isdoctor",
                        search.Operator.IS,
                        "T"
                    ]];

                    if (params.mdm_symptoms) {
                        doctorFilter.push("and");
                        doctorFilter.push([
                            "custentity_mdm_emp_tags",
                            search.Operator.CONTAINS,
                            params.mdm_symptoms
                        ]);
                    }

                    if (params.mdm_doctor != 0) {
                        doctorFilter.push("and");
                        doctorFilter.push([
                            "internalid",
                            search.Operator.IS,
                            params.mdm_doctor
                        ]);
                    }
                    
                    if (params.mdm_specialization) {
                        doctorFilter.push("and");
                        doctorFilter.push([
                            "custentity_mdm_emp_specialization",
                            search.Operator.ANYOF,
                            params.mdm_specialization
                        ]);
                    }

                    log.error('doctorFilter', doctorFilter);
                    var doctorFilterSearch = search.create({
                        type: "employee",
                        columns: ["internalid", "entityid"],
                        filters: doctorFilter
                    });


                    doctorFilterSearch.run().each(function (result) {
                        log.error('reulst', doctorResults.push(result.getValue('internalid')));
                        doctorResults.push(result.getValue('internalid'));
                        return true;
                    });

                    if (doctorResults.length > 0) {
                        if (clinicHoursFilter.length > 0) {
                            clinicHoursFilter.push("and");
                        }
                        clinicHoursFilter.push([
                            "custrecord_mdm_clinic_hours_doctor",
                            search.Operator.ANYOF,
                            doctorResults
                        ]);
                    } else {
                        if (clinicHoursFilter.length > 0) {
                            clinicHoursFilter.push("and");
                        }
                        clinicHoursFilter.push([
                            "custrecord_mdm_clinic_hours_doctor",
                            search.Operator.IS,
                            0
                        ]);
                    }


                }
                
            
                var doctorsList = []; 

                var clinicHourSearch = search.create({
                    type: "customrecord_mdm_clinic_hours",
                    columns: [
                        "internalid",
                        "custrecord_mdm_clinic_hours_doctor",
                        "custrecord_mdm_clinic_hospital",
                        "custrecord_mdm_clinic_hours_day",
                        "custrecord_mdm_clinic_hours_time",
                        "custrecord_mdm_clinic_hours_end_time"
                    ],
                    filters: clinicHoursFilter
                });

                clinicHourSearch.run().each(function (result) {
                    
                    var doctorUrl = url.resolveRecord({
                        recordType: "employee",
                        recordId: result.getValue("custrecord_mdm_clinic_hours_doctor"),
                        isEditMode: false
                    });

                    doctorsList.push({
                        "name": result.getText("custrecord_mdm_clinic_hours_doctor"),
                        "hospital": result.getText("custrecord_mdm_clinic_hospital"),
                        "day": result.getText("custrecord_mdm_clinic_hours_day"),
                        "start_time": result.getValue("custrecord_mdm_clinic_hours_time"),
                        "end_time": result.getValue("custrecord_mdm_clinic_hours_end_time"),
                        "schedule_appointment": '<a href="'+url.resolveRecord({
                            recordType: 'employee',
                            recordId: result.getValue('custrecord_mdm_clinic_hours_doctor'),
                            isEditMode: false
                        })+'" style="color: #607799">Schedule Appointment</a>'
                    });                    
                    return true;
                });

                list.addColumn({
                    id: "name",
                    type: serverWidget.FieldType.TEXT,
                    label: "Name"
                });
                list.addColumn({
                    id: "hospital",
                    type: serverWidget.FieldType.TEXT,
                    label: "Hospital"
                });
                list.addColumn({
                    id: "day",
                    type: serverWidget.FieldType.TEXT,
                    label: "Day"
                });
                list.addColumn({
                    id: "start_time",
                    type: serverWidget.FieldType.TEXT,
                    label: "Start Time"
                });
                list.addColumn({
                    id: "end_time",
                    type: serverWidget.FieldType.TEXT,
                    label: "End Time"
                });
                list.addColumn({
                    id: "schedule_appointment",
                    type: serverWidget.FieldType.TEXT,
                    label: "Action"
                });

                list.addRows({
                    rows: doctorsList
                });

                

                log.error('doctorsList', doctorsList);

                context.response.writePage(list);
        }

    }
}

});