(() => {
    'use strict';

    const modelConfig = require('../../configs/model');

    module.exports = {
        full_name: {
            type: modelConfig.dataTypes.string,
            required: true,
            validation_message: 'full name is required',
        },
        company_name: {
            type: modelConfig.dataTypes.string,
            required: true,
            validation_message: 'company name is required',
        },
    }

    //     start_date: {
    //         type: modelConfig.dataTypes.date,
    //         required: true,
    //         validation_message: 'start date is required',
    //     },
    //     end_date: {
    //         type: modelConfig.dataTypes.date,
    //         required: true,
    //         validation_message: "end date is required"
    //     },
    //     short_info: {
    //         type: modelConfig.dataTypes.string,
    //         required: true,
    //         validation_message: "short info is required"
    //     },
    //     link: {
    //         type: modelConfig.dataTypes.string,
    //         required: true,
    //         validation_message: "link is required"
    //     },
    //     active: {
    //         type: modelConfig.dataTypes.bool,
    //         required: true,
    //         validation_message: 'Active status is required',
    //         extra_validation_checks: [
    //             {
    //                 [modelConfig.validationChecks.isBoolean]: true,
    //                 validation_message: 'Please enter the boolean value',
    //             },
    //         ],
    //     },
    // };
})();
