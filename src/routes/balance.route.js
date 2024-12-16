var express = require("express");
const balanceController = require("../controllers/balance.controller.js");

var router = express.Router();

router.route("/").get(balanceController.getBalance);

module.exports = router;
