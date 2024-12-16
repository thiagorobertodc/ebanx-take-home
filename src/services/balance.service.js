const accounts = require("../models/accounts");

/**
 * Get balance by account id
 * @param {string} accountId
 * @returns {number} Account balance
 */
const getBalanceByAccountId = async (accountId) => {
  console.log("Accounts:", accounts);

  const account = accounts.find((acc) => acc.id == accountId);

  if (!account) {
    throw new Error("Account not found");
  }

  return account.balance;
};

module.exports = { getBalanceByAccountId };
