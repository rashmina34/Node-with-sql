const express = require("express");
const router = express.Router();
const demoUserController = require("./index");
const getDemoUser = require("./getDiscoveryDate");

router.route('/')
    .post(demoUserController.demoUser)

router.route('/discovery-date')
    .get(getDemoUser.getDiscoveryDate)

module.exports = router;
