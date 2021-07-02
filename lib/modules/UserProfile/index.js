const HTTPStatus = require('http-status');
const mysqlConnection = require('../../helpers/db.helper');
const config = require('./config')

exports.getUserInfoById = async (req, res, next) => {
    try {
        const [rows] = await mysqlConnection.query(
            `SELECT ?? FROM adminUser WHERE id=?`, ['*', `${req.params.id}`]);
        if (rows.length > 0) {
            let userObj = {
                full_name: rows[0].full_name,
                email: rows[0].email,
                id: rows[0].id,
                user_role: 'admin',
            }
            res.status(200).json({
                status: HTTPStatus.OK,
                message: 'get successfully',
                data: userObj,
            })
        } else {
            res.json({
                status: HTTPStatus.NOT_FOUND,
                message: config.message.notFound
            })
        }
    } catch (error) {
        res.status(500).json({
            status: HTTPStatus.INTERNAL_SERVER_ERROR,
            error: error
        })
    }

}
