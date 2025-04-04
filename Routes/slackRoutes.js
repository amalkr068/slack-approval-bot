const express = require("express");
const router = express.Router();
const handleSlashCommand = require("../Controllers/commandController");
const handleInteraction = require("../Controllers/interactionController");

router.post("/commands", handleSlashCommand);
router.post("/interactions", handleInteraction); // This handles both modal + button clicks

module.exports = router;
