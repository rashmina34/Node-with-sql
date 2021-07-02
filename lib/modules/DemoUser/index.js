const HTTPStatus = require('http-status');
// const configMessage = require("./config");
const { uuid } = require('uuidv4');
const insertHelper = require('../../queryHelper/insert.helper');
const moment = require('moment')

exports.demoUser = async (req, res, next) => {
    const _id = uuid();

    try {
        const added_on = new Date().toISOString().replace(/T/, " ").replace(/\..+/, '');
        const updated_on = new Date().toISOString().replace(/T/, " ").replace(/\..+/, '');
        // const discovery_date = new Date(req.body.discovery_date).toISOString().replace(/T/, " ")
        const discovery_date = moment(req.body.discovery_date).format("YYYY-MM-DD HH:mm")

        const added_by = 'InstaEStore';
        const updated_by = 'InstaEStore';

        const query = {
            full_name: `${req.body.full_name}`,
            company_name: `${req.body.company_name}`,
            email: `${req.body.email}`,
            phone_number: `${req.body.phone_number}`,
            discovery_date: `${discovery_date}`,
            added_on: `${added_on}`,
            updated_on: `${updated_on}`,
            added_by: `${req.body.full_name}`,
            updated_by: `${updated_by}`,
            // id: `${_id}`,
            deleted: 0
        };

        const insert = await insertHelper(query, `demoUser`);
        console.log(insert, '<<<<<<<<<insert');

        res.status(200).json({
            status: HTTPStatus.OK,
            message: "your information have been send successfully"
        });


    } catch (err) {
        res.status(500).json({
            status: HTTPStatus.INTERNAL_SERVER_ERROR,
            err: err.toString(),
            message: "Email address is already used"
        });
    }
}
