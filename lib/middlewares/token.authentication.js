const jwt = require('jsonwebtoken');
const mysqlConnection = require('../helpers/db.helper');

exports.checkToken = async (req, res, next) => {
    const hToken = req.headers['authorization'];

    try {
        let tokenQuery = `SELECT * FROM adminUser WHERE token="${hToken}"`
        let result = await mysqlConnection.query(tokenQuery, (error, rows, fields) => {
            if (error) {
                res.status(500).json({
                    message: "Database error",
                    errors: error
                });
            } else if (!error) {
                if (rows.length < 1) {
                    return res.json({
                        code: 401,
                        message: "Access Denied, No authentication token provided"
                    })
                } else if (rows.length > 0) {
                    try {
                        let decoded = jwt.verify(rows[0].token, process.env.privateKey);
                        req.decodedUser = decoded;
                        next();
                    } catch (error) {
                        if (error.name == "TokenExpiredError") {
                            return res.json({
                                message: "Sorry, your token is expired, please generate a new token"
                            })
                        }
                        next(error);
                    };
                };
            }
        })
    } catch (error) {
        next(error);
    }
}
