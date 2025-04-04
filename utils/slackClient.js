const { WebClient } = require("@slack/web-api");

if (!process.env.SLACK_BOT_TOKEN) {
    throw new Error("⚠️ SLACK_BOT_TOKEN is missing from environment variables.");
}

const slackClient = new WebClient(process.env.SLACK_BOT_TOKEN);

module.exports = slackClient;
