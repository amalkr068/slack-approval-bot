# Slack Approval Bot

This project is a Slack bot built with Node.js, Express, and MongoDB. It enables users to request approvals directly inside Slack using a slash command. Approvers can approve or reject the requests with just a click, and all activity is saved in a MongoDB database.

## Features

- Slack slash command to trigger an approval modal
- Modal with user selection and input for request details
- Direct messages sent to approvers with Approve and Reject buttons
- Responses are tracked and sent back to the requester
- Data stored in MongoDB for tracking and future use

## Folder Structure

slack-approval-bot  
│  
├── Controllers  
│   ├── commandController.js        // Handles slash command logic  
│   └── interactionController.js    // Handles modal submissions and button actions  
│  
├── Models  
│   └── Approval.js                 // Mongoose schema for storing approval requests  
│  
├── Routes  
│   └── slackRoutes.js              // Routes for Slack commands and interactions  
│  
├── utils  
│   └── slackClient.js              // Slack WebClient initialization  
│  
├── .env                            // Environment variables  
├── package.json                    // Dependencies and scripts  
├── server.js                       // Entry point for the Express server  

## Setup Instructions

### Prerequisites

- Node.js installed
- MongoDB database (Atlas or local)
- Slack App with the following setup:
  - Slash command: `/approval-test`
  - Interactivity enabled
  - Bot Token Scopes: `commands`, `chat:write`, `users:read`, `im:write`

### Installation

1. Clone the repository

   git clone https://github.com/your-username/slack-approval-bot  
   cd slack-approval-bot

2. Install dependencies

   npm install

3. Create a `.env` file in the root directory

    SLACK_BOT_TOKEN=your-slack-bot-token 
    SLACK_SIGNING_SECRET=your-signing-secret
    MONGO_URI=your-mongodb-connection-uri 
    PORT=4001



4. Start the server

node server.js

### Tunneling with Ngrok

To make your local server accessible to Slack:

ngrok http 4001

Copy the HTTPS forwarding URL and update your Slack App settings with the following:

- Slash Command URL: `https://your-ngrok-url/slack/commands`
- Interactivity URL: `https://your-ngrok-url/slack/interactions`

## Database

All requests are stored in MongoDB with the following fields:

- requesterId
- approverId
- details
- status (pending, approved, rejected)
- createdAt (auto-generated)

## Notes

- Make sure your Slack App is installed to your workspace
- Approvers and requesters must be members of the same Slack workspace
- If using MongoDB Atlas, allow your IP address or use 0.0.0.0/0 temporarily

## License

This project is open-source and free to use.

