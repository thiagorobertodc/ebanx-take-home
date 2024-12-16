const request = require("supertest");
const express = require("express");
const { getBalance } = require("../controllers/balance.controller");
const { balanceService } = require("../services");

// Mock the balanceService
jest.mock("../services", () => ({
  balanceService: {
    getBalanceByAccountId: jest.fn(),
  },
}));

const app = express();
app.use(express.json());
app.get("/balance", getBalance);

describe("GET /balance", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if account_id is missing", async () => {
    const response = await request(app).get("/balance");
    expect(response.status).toBe(400);
    expect(response.text).toBe("missing account id");
  });

  it("should return 404 if account does not exist", async () => {
    balanceService.getBalanceByAccountId.mockRejectedValue(
      new Error("Account not found")
    );

    const response = await request(app).get("/balance?account_id=1234");
    expect(response.status).toBe(404);
    expect(response.text).toBe("0");
    expect(balanceService.getBalanceByAccountId).toHaveBeenCalledWith(1234);
  });

  it("should return 200 and the balance if account exists", async () => {
    balanceService.getBalanceByAccountId.mockResolvedValue(100);

    const response = await request(app).get("/balance?account_id=1234");
    expect(response.status).toBe(200);
    expect(response.text).toBe("100");
    expect(balanceService.getBalanceByAccountId).toHaveBeenCalledWith(1234);
  });

  it("should handle non-integer account_id gracefully", async () => {
    const response = await request(app).get("/balance?account_id=invalid");
    expect(response.status).toBe(400);
    expect(response.text).toBe("missing account id");
  });

  it("should return 400 if account_id is null", async () => {
    const response = await request(app).get("/balance?account_id=");
    expect(response.status).toBe(400);
    expect(response.text).toBe("missing account id");
  });
});
