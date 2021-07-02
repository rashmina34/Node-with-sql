const passportAuth = (() => {
    'use strict';

    const HTTPStatus = require('http-status');
    const passport = require('passport')
    const LocalStrategy = require('passport-local').Strategy;
    const bcrypttHelper = require('../helpers/bcrypt.helper');
    const mysqlConnection = require("../helpers/db.helper");
    const loginCustomerError = require("../modules/Login/index");
    const moduleConfig = require('../modules/Login/config');

    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, async (req, email, password, done) => {
        try {
            const [rows] = await mysqlConnection.query(
                `SELECT * FROM adminUser WHERE email=?`, [`${req.body.email}`])
            if (rows.length > 0) {
                console.log(rows[0].email, '<<<<<<<<<emailQuery');

                if (!rows[0].email) {
                    return done(null, false, req.res.status(404).json({ message: 'Incorrect email.' }));
                }

                let result = await bcrypttHelper.comparePwd(req.body.password, rows[0].password);

                if (result == true) {

                    return done(null, rows[0]);
                } else {
                    return done(null, false, req.res.status(401).json({ message: 'Invalid Password' }));
                }
            } else {
                // return loginCustomerError.customErrorResponse(req, req.res, {
                //     message: 'User with this email address not found'
                // }, done)
                return done(req.res.status(404).json({
                    status: HTTPStatus.NOT_FOUND,
                    message: 'User with this email address not found'
                }))
            }
        } catch (error) {
            return done(error);
        }
    }
    ));
})();

module.exports = passportAuth;



