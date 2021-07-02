(() => {
    "use strict";

    module.exports = {
        message: {
            successful: "Email has been send to you. Check out your email",
            notFound: "Email address doesn't found",
            notMatch: "Email address doesn't match ",
            serverError: "Internal Server Error ",
            dbError: "Database Error",
            badReq: "Bad Request",
            invalidMessage: 'Invalid credentials',
        },
        config: {
            block_user_login_attempt: 14,
            block_mins: 5,
            block_ip_login_attempt_fixed_time: 9,
            captcha_enable_login_attempt: 5//after
        }
    };

})();
