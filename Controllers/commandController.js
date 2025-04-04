const slackClient = require("../utils/slackClient");

const handleSlashCommand = async (req, res) => {
    const { trigger_id, command } = req.body;

    if (command === "/approval-test") {
        res.status(200).send(); // Respond quickly

        try {
            await slackClient.views.open({
                trigger_id,
                view: {
                    type: "modal",
                    callback_id: "approval_modal",
                    title: { type: "plain_text", text: "Approval Request" },
                    submit: { type: "plain_text", text: "Submit" },
                    close: { type: "plain_text", text: "Cancel" },
                    blocks: [
                        {
                            type: "input",
                            block_id: "approver",
                            element: {
                                type: "users_select",
                                action_id: "approver_select"
                            },
                            label: { type: "plain_text", text: "Select Approver" }
                        },
                        {
                            type: "input",
                            block_id: "details",
                            element: {
                                type: "plain_text_input",
                                action_id: "request_details",
                                multiline: true
                            },
                            label: { type: "plain_text", text: "Enter Details" }
                        }
                    ]
                }
            });
        } catch (error) {
            console.error("Modal error:", error);
        }
    }
};

module.exports = handleSlashCommand;