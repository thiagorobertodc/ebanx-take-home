const catchAsync = require("../utils/catchAsync");
const { balanceService } = require("../services");

const getBalance = catchAsync(async (req, res) => {
  const accountId = parseInt(req.query.account_id);
  console.log(accountId);
  if (!accountId) {
    return res.status(400).send("missing account id");
  }
  try {
    const balance = await balanceService.getBalanceByAccountId(accountId);
    return res.status(200).send(`${balance}`);
  } catch (error) {
    return res.status(404).send("0");
  }
});

module.exports = { getBalance };
