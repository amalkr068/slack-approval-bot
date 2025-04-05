// 👇 Mock slackClient BEFORE importing anything else
jest.mock('../utils/slackClient', () => ({
  chat: {
    postMessage: jest.fn().mockResolvedValue({ ok: true }),
    update: jest.fn().mockResolvedValue({ ok: true })
  },
  conversations: {
    open: jest.fn().mockResolvedValue({
      channel: { id: "mock-dm-channel-id" }
    })
  }
}));

const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
const handleInteraction = require("../Controllers/interactionController");

// Mock ApprovalRequest model
jest.mock("../Models/Approval", () => ({
  findById: jest.fn(() =>
    Promise.resolve({
      _id: "mock-id",
      requesterId: "U123",
      details: "Mock request details",
      status: "pending",
      save: jest.fn().mockResolvedValue()
    })
  )
}));

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.post("/slack/interactions", handleInteraction);

describe("Interaction Controller", () => {
  it("handles approve button click", async () => {
    const payload = {
      type: "block_actions",
      user: { id: "U456" },
      actions: [{ action_id: "approve_action", value: "mock-id" }],
      channel: { id: "C123" },
      message: { ts: "12345.6789" }
    };

    const response = await request(app)
      .post("/slack/interactions")
      .type("form")
      .send(`payload=${encodeURIComponent(JSON.stringify(payload))}`);

    expect(response.statusCode).toBe(200);
  });

  it("returns 404 if request is not found", async () => {
    const ApprovalRequest = require("../Models/Approval");
    ApprovalRequest.findById.mockResolvedValueOnce(null);

    const payload = {
      type: "block_actions",
      user: { id: "U456" },
      actions: [{ action_id: "approve_action", value: "invalid-id" }],
      channel: { id: "C123" },
      message: { ts: "12345.6789" }
    };

    const response = await request(app)
      .post("/slack/interactions")
      .type("form")
      .send(`payload=${encodeURIComponent(JSON.stringify(payload))}`);

    expect(response.statusCode).toBe(404);
  });
});
