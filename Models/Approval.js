const mongoose = require("mongoose");

const approvalSchema = new mongoose.Schema({
    requesterId: String,
    approverId: String,
    details: String,
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    createdAt: { type: Date, default: Date.now },
});

const ApprovalRequest = mongoose.model("ApprovalRequest", approvalSchema);

module.exports = ApprovalRequest;
