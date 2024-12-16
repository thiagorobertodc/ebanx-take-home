const {
  createOrDepositAccount,
  withdrawFromAccount,
  transfer,
} = require("../services/event.service");
const accounts = require("../models/accounts");

jest.mock("../models/accounts", () => []); // Mock accounts as an empty array

describe("Event Service", () => {
  beforeEach(() => {
    accounts.length = 0; // Reset accounts before each test
  });

  describe("createOrDepositAccount", () => {
    it("should create a new account if destination does not exist", async () => {
      const result = await createOrDepositAccount("100", 50);

      expect(result).toEqual({ id: "100", balance: 50 });
      expect(accounts).toHaveLength(1);
      expect(accounts[0]).toEqual({ id: "100", balance: 50 });
    });

    it("should deposit to an existing account", async () => {
      accounts.push({ id: "100", balance: 20 });

      const result = await createOrDepositAccount("100", 30);

      expect(result).toEqual({ id: "100", balance: 50 });
      expect(accounts).toHaveLength(1);
      expect(accounts[0]).toEqual({ id: "100", balance: 50 });
    });
  });

  describe("withdrawFromAccount", () => {
    it("should withdraw from an existing account", async () => {
      accounts.push({ id: "200", balance: 100 });

      const result = await withdrawFromAccount("200", 40);

      expect(result).toEqual({ id: "200", balance: 60 });
      expect(accounts[0]).toEqual({ id: "200", balance: 60 });
    });

    it("should throw an error if the account does not exist", async () => {
      await expect(withdrawFromAccount("300", 50)).rejects.toThrow(
        "Account not found"
      );
    });
  });

  describe("transfer", () => {
    it("should transfer funds between two existing accounts", async () => {
      accounts.push({ id: "100", balance: 100 }, { id: "200", balance: 50 });

      const result = await transfer("100", 30, "200");

      expect(result).toEqual({
        origin: { id: "100", balance: 70 },
        destination: { id: "200", balance: 80 },
      });

      expect(accounts[0]).toEqual({ id: "100", balance: 70 });
      expect(accounts[1]).toEqual({ id: "200", balance: 80 });
    });

    it("should create a new destination account if it does not exist", async () => {
      accounts.push({ id: "100", balance: 100 });

      const result = await transfer("100", 30, "300");

      expect(result).toEqual({
        origin: { id: "100", balance: 70 },
        destination: { id: "300", balance: 30 },
      });

      expect(accounts).toHaveLength(2);
      expect(accounts[0]).toEqual({ id: "100", balance: 70 });
      expect(accounts[1]).toEqual({ id: "300", balance: 30 });
    });

    it("should throw an error if the origin account does not exist", async () => {
      await expect(transfer("400", 20, "500")).rejects.toThrow(
        "Couldnt find origin account"
      );
    });
  });
});
