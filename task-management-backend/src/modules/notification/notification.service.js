const Notification = require("./notification.model");
const { sendPushNotification, sendMultiplePushNotifications } = require("../../utils/sendPushNotification");
const paginate = require("../../utils/pagination");

// Create and send notification
const sendNotification = async ({
    recipient,
    company,
    type,
    title,
    body,
    data = {},
    fcmToken = null,
}) => {
    // Log to DB
    await Notification.create({
        recipient,
        company,
        type,
        title,
        body,
        data,
    });

    // Send push if token available
    if (fcmToken) {
        await sendPushNotification({ token: fcmToken, title, body, data });
    }
};

// Get notifications for a user
const getUserNotifications = async (userId, query) => {
    const { page, limit, skip } = paginate(query);

    const [notifications, total] = await Promise.all([
        Notification.find({ recipient: userId })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }),
        Notification.countDocuments({ recipient: userId }),
    ]);

    return {
        notifications,
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
};

// Mark notification as read
const markAsRead = async (id, userId) => {
    return await Notification.findOneAndUpdate(
        { _id: id, recipient: userId },
        { isRead: true },
        { new: true }
    );
};

// Mark all as read
const markAllAsRead = async (userId) => {
    await Notification.updateMany(
        { recipient: userId, isRead: false },
        { isRead: true }
    );
};

module.exports = {
    sendNotification,
    getUserNotifications,
    markAsRead,
    markAllAsRead,
};