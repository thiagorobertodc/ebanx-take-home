var express = require("express");
const resetController = require("../controllers/reset.controller.js");

var router = express.Router();

router.route("/").post(resetController.resetState);

module.exports = router;
