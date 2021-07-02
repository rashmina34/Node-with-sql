((routeHelper) => {
    'use strict';

    routeHelper.init = (app) => {
        const register = require('../modules/Signup/routes');
        app.use('/api/user', register);

        const login = require('../modules/Login/routes');
        app.use('/api/login', login);

        const forgotPwd = require('../modules/forgot-password/routes');
        app.use('/api/user-forgot-password', forgotPwd);

        const resetPswd = require('../modules/ResetPassword/routes');
        app.use('/api/reset-password', resetPswd);

        const userProfile = require('../modules/UserProfile/routes');
        app.use('/api/user/data', userProfile)

        const demoUser = require('../modules/DemoUser/routes');
        app.use('/api/demo-user', demoUser);

        const logout = require('../modules/Logout/routes');
        app.use('/api/logout', logout)
    }
})(module.exports);