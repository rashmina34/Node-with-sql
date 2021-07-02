const mysqlConnection = require('../../../helpers/db.helper');
const config = require('../config');
const HTTPStatus = require('http-status');

exports.getAllUsers = async (req, res) => {
    try {
        const page = ((req.query.page) - 1) || 0;
        const perpage = req.query.perpage || 10;
        const attributes = ["full_name", "company_name", "email", "phone_number", "discovery_date"];
        const [rows] = await mysqlConnection.query(
            `SELECT ?? FROM ?? WHERE deleted=? LIMIT ${page},${perpage}`, [attributes, "userRegistration", "false"]);
        if (rows !== null) {
            res.json({
                message: config.messageConfig.user.getAll,
                response: rows
            })
        }

    } catch (err) {
        res.json({
            status_code: HTTPStatus.INTERNAL_SERVER_ERROR,
            message: err
        });
    }
};