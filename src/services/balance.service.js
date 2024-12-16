const accounts = require("../models/accounts");
/**
 * Get balance by account id
 * @param {number} accountId
 * @returns {number} balance value
 */
const getBalanceByAccountId = async (accountId) => {
  if (!accounts[accountId]) {
    throw new Error("Account not found");
  }

  return accounts[accountId];
};

module.exports = { getBalanceByAccountId };
