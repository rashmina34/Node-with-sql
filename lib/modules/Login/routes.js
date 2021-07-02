const express = require("express");
const router = express.Router();
const userController = require("./index");
var passport = require('passport');
require('../../auth/passport');

router.post("/", passport.authenticate('local', { session: false }), userController.login_user);

module.exports = router;


