const mysqlConnection = require('../../helpers/db.helper');
const config = require('./config');
const HTTPStatus = require('http-status');

exports.getDiscoveryDate = async (req, res) => {
    try {
        const page = ((req.query.page) - 1) || 0;
        const perpage = req.query.perpage || 10;
        const [rows] = await mysqlConnection.query(
            `SELECT discovery_date FROM ?? WHERE deleted=?`, ["demoUser", "false"]);
        if (rows.length > 0) {
            res.json({
                message: config.messages.successfullyGet,
                discoveryDate: rows
            })
        } else {
            res.status(404).json({
                status: HTTPStatus.NOT_FOUND,
                message: config.messages.notFound
            })
        }

    } catch (err) {
        res.json({
            status_code: HTTPStatus.INTERNAL_SERVER_ERROR,
            error: err,
            message: config.messages.serverError
        });
    }
};