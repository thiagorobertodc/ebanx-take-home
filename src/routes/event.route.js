var express = require("express");
const eventController = require("../controllers/event.controller.js");

var router = express.Router();

router.route("/").post(eventController.handleAccountOps);

module.exports = router;
