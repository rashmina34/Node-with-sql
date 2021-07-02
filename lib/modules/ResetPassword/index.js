const HTTPStatus = require('http-status');
const config = require('./config');
const mysqlConnection = require('../../helpers/db.helper');
const bcryptHelper = require("../../helpers/bcrypt.helper");

exports.resetPassword = async (req, res, next) => {
    const [rows] = await mysqlConnection.query(`SELECT ?? FROM userRegistration WHERE id=?`, ["password", `${req.params.id}`])
    try {

        if (rows.length > 0) {
            let resultPswds = await bcryptHelper.comparePwd(req.body.oldPassword, rows[0].password);

            if (resultPswds === true) {
                const salt = await bcryptHelper.generateSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS));
                const enPassword = await bcryptHelper.hashPwd(req.body.password, salt);

                // let updatePaswd = `update userRegistration set password="${enPassword}" where id="${req.params.id}"`;
                const updateQuery = await mysqlConnection.query(
                    `update userRegistration set password=? where id=?`, [`${enPassword}`, `${req.params.id}`]
                )
                res.status(200).json({
                    status: HTTPStatus.OK,
                    message: "Password updated successfully"
                })
            } else
                res.status(404).json({
                    status: HTTPStatus.NOT_FOUND,
                    message: "password mismatch"
                })
        }
    } catch (error) {
        res.json({
            message: "Something went wrong your old password may mismatch",
            error: error
        })
    }
}