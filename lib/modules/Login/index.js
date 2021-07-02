const HTTPStatus = require('http-status');
const tokenGenerator = require('../../helpers/jwt.helper');
const mysqlConnection = require('../../helpers/db.helper');
const config = require('./config')

exports.login_user = async (req, res, next) => {
    try {
        if (!req.session.secretKey) {
            const [rows] = await mysqlConnection.query(
                `SELECT * FROM ?? WHERE email=?`, ["adminUser", `${req.body.email}`]);
            if (rows.length > 0) {

                const userObj = {
                    full_name: rows[0].full_name,
                    company_name: rows[0].company_name,
                    phone_number: rows[0].phone_number,
                    discovery_date: rows[0].discovery_date,
                    email: rows[0].email,
                    id: rows[0].id,
                    user_role: 'admin',
                }

                const token = tokenGenerator.generateToken({ userObj });
                console.log("Token =" + typeof token + token);

                const user = await mysqlConnection.query(
                    `UPDATE adminUser set token=? WHERE email=?`, [`${token}`, `${req.body.email}`])

                if (user !== null) {
                    res.status(200).json({
                        status: HTTPStatus.OK,
                        token: token,
                        // userInfo: userObj.id,
                        userInfo: userObj,
                    })
                }
            }
        }
    } catch (error) {
        res.status(500).json({
            status: HTTPStatus.INTERNAL_SERVER_ERROR,
            message: config.message.serverError
        })
    }
}

exports.customerError = (req, res, { status_code, message, data }, done) => {
    const loginStatusMessage = {
        success: false,
        status_code: status_code,
        message: message
    };

    req.loginStatusMessage = loginStatusMessage;
    return done(null, false, loginStatusMessage);
};

exports.customErrorResponse = (req, res, { message, data }, done) => {
    const loginStatusMessage = {
        success: false,
        message: message,
    };
    req.loginStatusMessage = loginStatusMessage;
    return done(null, loginStatusMessage);
};
