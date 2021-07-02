const mysqlConnection = require('../../helpers/db.helper');
const HTTPStatus = require('http-status')

exports.logoutUser = async (req, res, next) => {

    let getUser = `update`
    try {
        let deleteJWT = await mysqlConnection.query(
            `UPDATE adminUser set token = ?`, [" "]
        )
        res.json({
            status: HTTPStatus.OK,
            message: "User logged out successfully"
        })

        // let deleteJWT = await collection.update({ _id: ObjectID(req.decodedUser.userId) }, { $unset: { jwtToken: "" } });
        // res.json(util.renderApiData(req, res, '200', 'Successfully logout', {}));


    } catch (error) {
        next(error);
    }
}