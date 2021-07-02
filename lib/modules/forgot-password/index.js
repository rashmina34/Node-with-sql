const HTTPStatus = require('http-status');
const mysqlConnection = require('../../helpers/db.helper');
const sendEmail = require("../../helpers/email.helper");
const pwdGenerator = require("generate-password");
const config = require('./configs');
const bcryptHelper = require("../../helpers/bcrypt.helper");

exports.forgot_password = async (req, res, next) => {

    let emailChk = `SELECT * FROM userRegistration WHERE email="${req.body.email}"`;
    let emailQuery = await mysqlConnection.query(emailChk, async (error, rows, fields) => {
        if (error) {
            res.status(500).json({
                status: HTTPStatus.INTERNAL_SERVER_ERROR,
                message: error,
            })
        } else if (!error) {
            if (rows.length < 1) {
                res.status(404).json({
                    status: HTTPStatus.NOT_FOUND,
                    message: config.message.notFound,
                })
            } else {
                if (rows.length > 0 && req.body.email === rows[0].email) {

                    const password = pwdGenerator.generate({
                        length: 10,
                        numbers: true,
                    });

                    const salt = await bcryptHelper.generateSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS));
                    const enPassword = await bcryptHelper.hashPwd(password, salt);
                    let updatePwd = `UPDATE userRegistration set password="${enPassword}" WHERE email="${req.body.email}"`;
                    let updateQuery = await mysqlConnection.query(updatePwd, (error, result, fields) => {
                        if (error) {
                            res.status(500).json({
                                status: HTTPStatus.INTERNAL_SERVER_ERROR,
                                message:
                                    error,
                            })
                        } else if (!error) {
                            let userDetails = {
                                mail: req.body.email,
                                username: req.body.email,
                                password: password
                            }
                            sendEmail.sendEmail(userDetails, req);
                            res.status(200).json({
                                status: HTTPStatus.OK,
                                message: config.message.successful
                            })
                        }
                    })
                } else {
                    res.status(404).json({
                        status: HTTPStatus.NOT_FOUND,
                        message: config.message.notFound,
                    })
                }
            }
        }
    })




}
