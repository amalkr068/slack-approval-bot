require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

// 🧩 Import routes
const slackRoutes = require("./Routes/slackRoutes"); // Ensure path is correct

const app = express();
const PORT = process.env.PORT || 4001;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 👇 Use Slack routes
app.use("/slack", slackRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("✅ Connected to MongoDB");
  console.log("🧪 Mongoose ready state:", mongoose.connection.readyState);
  console.log("🔗 DB name:", mongoose.connection.name);

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
})
.catch(err => {
  console.error("❌ MongoDB connection error:", err);
});
