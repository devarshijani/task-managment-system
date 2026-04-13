const express = require("express");
const router = express.Router();
const { authenticate } = require("../../middlewares/auth.middleware");
const { authorize } = require("../../middlewares/rbac.middleware");
const asyncHandler = require("../../utils/asyncHandler");
const sendResponse = require("../../utils/response");
const historyService = require("./history.service");

router.get(
    "/task/:taskId",
    authenticate,
    authorize("admin", "user"),
    asyncHandler(async (req, res) => {
        const result = await historyService.getHistoryByTask(
            req.params.taskId,
            req.query
        );
        return sendResponse(res, 200, true, "History fetched successfully", result);
    })
);

module.exports = router;