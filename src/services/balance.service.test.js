const { getBalanceByAccountId } = require("../services/balance.service");
const accounts = require("../models/accounts");

jest.mock("../models/accounts", () => []); // Mock accounts as an empty array

describe("getBalanceByAccountId", () => {
  beforeEach(() => {
    accounts.length = 0; // Reset accounts before each test
  });

  it("should return the balance for an existing account", async () => {
    accounts.push({ id: "100", balance: 50 });

    const balance = await getBalanceByAccountId("100");

    expect(balance).toBe(50);
    expect(accounts).toHaveLength(1);
    expect(accounts[0]).toEqual({ id: "100", balance: 50 });
  });

  it("should throw an error if the account does not exist", async () => {
    await expect(getBalanceByAccountId("200")).rejects.toThrow(
      "Account not found"
    );
  });

  it("should handle multiple accounts and return the correct balance", async () => {
    accounts.push(
      { id: "100", balance: 50 },
      { id: "200", balance: 30 },
      { id: "300", balance: 70 }
    );

    const balance = await getBalanceByAccountId("300");

    expect(balance).toBe(70);
    expect(accounts).toHaveLength(3);
    expect(accounts[2]).toEqual({ id: "300", balance: 70 });
  });

  it("should handle account IDs as strings or numbers", async () => {
    accounts.push({ id: "100", balance: 50 });

    const balance = await getBalanceByAccountId(100); // Pass number instead of string

    expect(balance).toBe(50);
    expect(accounts).toHaveLength(1);
    expect(accounts[0]).toEqual({ id: "100", balance: 50 });
  });
});
