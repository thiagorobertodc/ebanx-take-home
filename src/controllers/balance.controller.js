const catchAsync = require("../utils/catchAsync");

const getBalance = catchAsync(async (req, res) => {
  res.send("respond with a resource");
});

module.exports = { getBalance };
