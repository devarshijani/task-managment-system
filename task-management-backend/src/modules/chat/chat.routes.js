const express = require("express");
const router = express.Router();
const asyncHandler = require("../../utils/asyncHandler");
const sendResponse = require("../../utils/response");
const { getChatHistory } = require("./chat.service");
const { authenticate } = require("../../middlewares/auth.middleware");
const { authorize } = require("../../middlewares/rbac.middleware");

// Get chat history for a project
router.get(
    "/:projectId",
    authenticate,
    authorize("admin", "user"),
    asyncHandler(async (req, res) => {
        const result = await getChatHistory(req.params.projectId, req.query);
        return sendResponse(res, 200, true, "Chat history fetched", result);
    })
);

module.exports = router;