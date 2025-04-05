jest.mock('../utils/slackClient'); // 👈 MUST COME FIRST

const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
const handleSlashCommand = require("../Controllers/commandController");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.post("/slack/commands", handleSlashCommand);

describe("Slash Command Handler", () => {
  it("should respond with 200 for /approval-test", async () => {
    const response = await request(app)
      .post("/slack/commands")
      .type("form")
      .send({
        trigger_id: "test_trigger",
        command: "/approval-test"
      });

    expect(response.statusCode).toBe(200);
  });
});
