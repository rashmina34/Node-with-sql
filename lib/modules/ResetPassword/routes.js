const express = require("express");
const router = express.Router();
const authenticationMiddleware = require('../../middlewares/token.authentication');
const userController = require("./index");

router.route('/:id')
    .post(authenticationMiddleware.checkToken, userController.resetPassword);

module.exports = router;
