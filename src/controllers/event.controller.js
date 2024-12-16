const catchAsync = require("../utils/catchAsync");
const { eventService } = require("../services");

const handleAccountOps = catchAsync(async (req, res) => {
  const { type, destination, origin, amount } = req.body;

  if (!type || (!destination && !origin) || amount == null) {
    return res.status(400).send("Bad request - Missing required fields");
  }

  let account;

  switch (type) {
    case "deposit":
      account = await eventService.createOrDepositAccount(destination, amount);
      return res
        .status(201)
        .send(`{ "destination": ${JSON.stringify(account)} }`);

    case "withdrawn":
      account = await eventService.withdrawnFromAccount(origin, amount);
      return res
        .status(201)
        .send(`{ "destination": ${JSON.stringify(account)} }`);

    case "withdrawn":
      account = await eventService.withdrawnFromAccount(origin, amount);
      return res
        .status(201)
        .send(`{ "destination": ${JSON.stringify(account)} }`);

    default:
      return res.status(400).send("Bad request - Invalid operation type");
  }
});

module.exports = { handleAccountOps };
