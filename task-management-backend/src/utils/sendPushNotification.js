const admin = require("../config/firebase");

const sendPushNotification = async ({ token, title, body, data = {} }) => {
    try {
        if (!token) return;

        const message = {
            token,
            notification: { title, body },
            data: {
                ...data,
                timestamp: new Date().toISOString(),
            },
        };

        await admin.messaging().send(message);
        console.log(`✅ Push notification sent`);
    } catch (err) {
        console.error(`❌ Push notification error: ${err.message}`);
    }
};

const sendMultiplePushNotifications = async ({ tokens, title, body, data = {} }) => {
    try {
        if (!tokens || tokens.length === 0) return;

        const message = {
            tokens,
            notification: { title, body },
            data: {
                ...data,
                timestamp: new Date().toISOString(),
            },
        };

        await admin.messaging().sendEachForMulticast(message);
        console.log(`✅ Push notifications sent to ${tokens.length} devices`);
    } catch (err) {
        console.error(`❌ Push notification error: ${err.message}`);
    }
};

module.exports = { sendPushNotification, sendMultiplePushNotifications };