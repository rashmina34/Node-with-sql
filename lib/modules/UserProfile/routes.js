const express = require("express");
const router = express.Router();
const userController = require("./index");
const authenticationMiddleware = require('../../middlewares/token.authentication');

router.route('/:id')
    .get(authenticationMiddleware.checkToken, userController.getUserInfoById)

module.exports = router;
