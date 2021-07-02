const express = require("express");
const router = express.Router();
const userController = require("./index");
const authenticationMiddleware = require('../../middlewares/token.authentication');

router.route('/')
    .delete(authenticationMiddleware.checkToken, userController.logoutUser)

module.exports = router;
