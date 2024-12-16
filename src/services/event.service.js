const accounts = require("../models/accounts");
/**
 * Create account or deposit to an existing one
 * @param {number} destination
 * @param {number} amount
 * @returns {Object} account info
 */
const createOrDepositAccount = async (destination, amount) => {
  const accountIndex = accounts.findIndex(
    (account) => account.id === destination
  );

  if (accountIndex === -1) {
    const accObj = { id: destination, balance: amount };
    accounts.push(accObj);
    return accObj;
  }

  accounts[accountIndex].balance += amount;
  return accounts[accountIndex];
};

const withdrawnFromAccount = async (origin, amount) => {
  const accountIndex = accounts.findIndex((account) => account.id === origin);

  if (accountIndex === -1) {
    throw new Error("Account not found");
  }

  accounts[accountIndex].balance -= amount;
  return accounts[accountIndex];
};

module.exports = { createOrDepositAccount, withdrawnFromAccount };
