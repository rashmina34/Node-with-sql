const express = require("express");
const router = express.Router();
const userController = require("./index");
const userList = require("./Methods/getAllUser")

router.route('/')
    .post(userController.create_user)

router.route('/all-users')
    .get(userList.getAllUsers)

module.exports = router;
