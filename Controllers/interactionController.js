const ApprovalRequest = require("../Models/Approval");
const slackClient = require("../utils/slackClient");

const handleInteraction = async (req, res) => {
  const payload = JSON.parse(req.body.payload);
  console.log("🔄 Interaction Payload:", JSON.stringify(payload, null, 2));

  // 🟢 Handle modal submission
  if (payload.type === 'view_submission') {
    const approverId = payload.view.state.values.approver.approver_select.selected_user;
    const details = payload.view.state.values.details.request_details.value;
    const requesterId = payload.user.id;

    try {
      const newRequest = await ApprovalRequest.create({
        requesterId,
        approverId,
        details,
        status: "pending"
      });

      console.log("✅ Request saved to DB:", newRequest);

      const dm = await slackClient.conversations.open({ users: approverId });
      const dmChannel = dm.channel.id;

      await slackClient.chat.postMessage({
        channel: dmChannel,
        text: `*Approval Request*`,
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*From:* <@${requesterId}>\n*Details:*\n${details}`
            }
          },
          {
            type: "actions",
            block_id: "approval_buttons",
            elements: [
              {
                type: "button",
                text: { type: "plain_text", text: "✅ Approve" },
                style: "primary",
                value: newRequest._id.toString(),
                action_id: "approve_action"
              },
              {
                type: "button",
                text: { type: "plain_text", text: "❌ Reject" },
                style: "danger",
                value: newRequest._id.toString(),
                action_id: "reject_action"
              }
            ]
          }
        ]
      });

      return res.status(200).send(); // success
    } catch (err) {
      console.error("❌ Error during modal submission DB save:", err);
      return res.status(500).send();
    }
  }

  // 🔴 Handle Approve / Reject button clicks
  if (payload.type === 'block_actions') {
    const action = payload.actions[0];
    const requestId = action.value;
    const decision = action.action_id === 'approve_action' ? 'approved' : 'rejected';
    const approverId = payload.user.id;

    try {
      const request = await ApprovalRequest.findById(requestId);
      if (!request) {
        console.warn("⚠️ Request not found with ID:", requestId);
        return res.status(404).send({ text: 'Request not found.' });
      }

      request.status = decision;
      await request.save();
      console.log(`✅ Request ID ${requestId} marked as "${decision}"`);

      const dm = await slackClient.conversations.open({ users: request.requesterId });
      const requesterChannel = dm.channel.id;

      await slackClient.chat.postMessage({
        channel: requesterChannel,
        text: `Your request has been *${decision}* by <@${approverId}>.\n\n📋 *Details:*\n${request.details}`
      });

      await slackClient.chat.update({
        channel: payload.channel.id,
        ts: payload.message.ts,
        text: `*Request has been ${decision}* by <@${approverId}>.`,
        blocks: []
      });

      return res.status(200).send();
    } catch (error) {
      console.error("❌ Error handling approval/rejection:", error);
      return res.status(500).send();
    }
  }

  return res.status(200).send(); // fallback
};

module.exports = handleInteraction;
