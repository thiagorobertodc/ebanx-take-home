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

const withdrawFromAccount = async (origin, amount) => {
  const accountIndex = accounts.findIndex((account) => account.id === origin);

  if (accountIndex === -1) {
    throw new Error("Account not found");
  }

  accounts[accountIndex].balance -= amount;
  return accounts[accountIndex];
};

const transfer = async (origin, amount, destination) => {
  console.log("starting transfer...");
  const originIndex = accounts.findIndex((account) => account.id == origin);
  let destinationIndex = accounts.findIndex(
    (account) => account.id == destination
  );

  console.log(originIndex);
  console.log(destinationIndex);

  if (originIndex == -1) {
    throw new Error("Couldnt find origin account");
  }

  if (destinationIndex == -1) {
    const accObj = { id: destination, balance: amount };
    accounts.push(accObj);
    destinationIndex = accounts.findIndex(
      (account) => account.id === destination
    );

    accounts[originIndex].balance -= amount;
    console.log(accounts);

    return {
      origin: accounts[originIndex],
      destination: accounts[destinationIndex],
    };
  }

  accounts[originIndex].balance -= amount;
  accounts[destinationIndex].balance += amount;

  console.log(accounts);

  return {
    origin: accounts[originIndex],
    destination: accounts[destinationIndex],
  };
};

module.exports = { createOrDepositAccount, withdrawFromAccount, transfer };
