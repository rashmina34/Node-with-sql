const express = require("express");
const router = express.Router();
const userController = require("./index");

router.route('/')
    .post(userController.forgot_password)

module.exports = router;
