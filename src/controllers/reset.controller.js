const catchAsync = require("../utils/catchAsync");
const accounts = require("../models/accounts");

const resetState = catchAsync(async (req, res) => {
  accounts.length = 0;
  return res.status(200).send("OK");
});

module.exports = { resetState };
