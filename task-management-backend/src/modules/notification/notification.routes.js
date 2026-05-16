const express = require("express");
const router = express.Router();
const asyncHandler = require("../../utils/asyncHandler");
const sendResponse = require("../../utils/response");
const notificationService = require("./notification.service");
const { authenticate } = require("../../middlewares/auth.middleware");
const { authorize } = require("../../middlewares/rbac.middleware");

// Get my notifications
router.get(
    "/",
    authenticate,
    authorize("admin", "user"),
    asyncHandler(async (req, res) => {
        const result = await notificationService.getUserNotifications(
            req.user._id,
            req.query
        );
        return sendResponse(res, 200, true, "Notifications fetched", result);
    })
);

// Mark single notification as read
router.put(
    "/:id/read",
    authenticate,
    authorize("admin", "user"),
    asyncHandler(async (req, res) => {
        const notification = await notificationService.markAsRead(
            req.params.id,
            req.user._id
        );
        return sendResponse(res, 200, true, "Notification marked as read", notification);
    })
);

// Mark all as read
router.put(
    "/read-all",
    authenticate,
    authorize("admin", "user"),
    asyncHandler(async (req, res) => {
        await notificationService.markAllAsRead(req.user._id);
        return sendResponse(res, 200, true, "All notifications marked as read");
    })
);

module.exports = router;