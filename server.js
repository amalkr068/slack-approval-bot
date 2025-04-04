require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const slackRoutes = require("./Routes/slackRoutes");

const app = express();
const PORT = process.env.PORT || 4001;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log(" Connected to MongoDB"))
    .catch(err => console.error("MongoDB Error:", err));

// Routes
app.use("/slack", slackRoutes);

// Start Server
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
