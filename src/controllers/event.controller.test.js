const request = require("supertest");
const express = require("express");
const { handleAccountOps } = require("../controllers/event.controller");
const { eventService } = require("../services");

jest.mock("../services", () => ({
  eventService: {
    createOrDepositAccount: jest.fn(),
    withdrawFromAccount: jest.fn(),
    transfer: jest.fn(),
  },
}));

const app = express();
app.use(express.json());
app.post("/event", handleAccountOps);

describe("POST /event", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 for missing required fields", async () => {
    const response = await request(app).post("/event").send({});
    expect(response.status).toBe(400);
    expect(response.text).toBe("Bad request - Missing required fields");
  });

  it("should handle deposit operations", async () => {
    eventService.createOrDepositAccount.mockResolvedValue({
      id: "100",
      balance: 50,
    });

    const response = await request(app)
      .post("/event")
      .send({ type: "deposit", destination: "100", amount: 50 });

    expect(response.status).toBe(201);
    expect(response.text).toBe(`{ "destination": {"id":"100","balance":50} }`);
    expect(eventService.createOrDepositAccount).toHaveBeenCalledWith("100", 50);
  });

  it("should handle withdrawal operations", async () => {
    eventService.withdrawFromAccount.mockResolvedValue({
      id: "200",
      balance: 30,
    });

    const response = await request(app)
      .post("/event")
      .send({ type: "withdraw", origin: "200", amount: 20 });

    expect(response.status).toBe(201);
    expect(response.text).toBe(`{ "origin": {"id":"200","balance":30} }`);
    expect(eventService.withdrawFromAccount).toHaveBeenCalledWith("200", 20);
  });

  it("should handle transfer operations", async () => {
    eventService.transfer.mockResolvedValue({
      origin: { id: "200", balance: 20 },
      destination: { id: "300", balance: 15 },
    });

    const response = await request(app).post("/event").send({
      type: "transfer",
      origin: "200",
      destination: "300",
      amount: 15,
    });

    expect(response.status).toBe(201);
    expect(response.text).toBe(
      `{ "origin": {"id":"200","balance":20}, "destination": {"id":"300","balance":15} }`
    );
    expect(eventService.transfer).toHaveBeenCalledWith("200", 15, "300");
  });

  it("should return 400 for invalid operation type", async () => {
    const response = await request(app)
      .post("/event")
      .send({ type: "invalid", destination: "100", amount: 50 });

    expect(response.status).toBe(400);
    expect(response.text).toBe("Bad request - Invalid operation type");
  });

  it("should return 404 if account is not found", async () => {
    eventService.createOrDepositAccount.mockRejectedValue(
      new Error("Account not found")
    );

    const response = await request(app)
      .post("/event")
      .send({ type: "deposit", destination: "100", amount: 50 });

    expect(response.status).toBe(404);
    expect(response.text).toBe("0");
    expect(eventService.createOrDepositAccount).toHaveBeenCalledWith("100", 50);
  });
});
