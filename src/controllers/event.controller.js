const catchAsync = require("../utils/catchAsync");
const { eventService } = require("../services");

const handleAccountOps = catchAsync(async (req, res) => {
  const { type, destination, origin, amount } = req.body;

  if (!type || (!destination && !origin) || amount == null) {
    return res.status(400).send("Bad request - Missing required fields");
  }

  let account;

  try {
    switch (type) {
      case "deposit":
        account = await eventService.createOrDepositAccount(
          destination,
          amount
        );
        return res
          .status(201)
          .send(`{ "destination": ${JSON.stringify(account)} }`);

      case "withdraw":
        account = await eventService.withdrawFromAccount(origin, amount);
        return res.status(201).send(`{ "origin": ${JSON.stringify(account)} }`);

      case "transfer":
        const transferAccounts = await eventService.transfer(
          origin,
          amount,
          destination
        );
        return res
          .status(201)
          .send(
            `{ "origin": ${JSON.stringify(
              transferAccounts.origin
            )}, "destination": ${JSON.stringify(
              transferAccounts.destination
            )} }`
          );

      default:
        return res.status(400).send("Bad request - Invalid operation type");
    }
  } catch {
    return res.status(404).send("0");
  }
});

module.exports = { handleAccountOps };
