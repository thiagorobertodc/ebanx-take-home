const request = require("supertest");
const express = require("express");
const { resetState } = require("../controllers/reset.controller");
const accounts = require("../models/accounts");

jest.mock("../models/accounts", () => []);

const app = express();
app.post("/reset", resetState);

describe("POST /reset", () => {
  beforeEach(() => {
    accounts.push({ id: "100", balance: 20 });
  });

  it("should reset the accounts array", async () => {
    expect(accounts).toHaveLength(1);
    const response = await request(app).post("/reset");
    expect(response.status).toBe(200);
    expect(response.text).toBe("OK");
    expect(accounts).toHaveLength(0);
  });

  it("should return 200 and 'OK' even if accounts array is already empty", async () => {
    accounts.length = 0;
    const response = await request(app).post("/reset");
    expect(response.status).toBe(200);
    expect(response.text).toBe("OK");
    expect(accounts).toHaveLength(0);
  });
});
