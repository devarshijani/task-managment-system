let admin = null;

try {
    const firebaseAdmin = require("firebase-admin");

    if (
        process.env.FCM_PROJECT_ID &&
        process.env.FCM_CLIENT_EMAIL &&
        process.env.FCM_PRIVATE_KEY &&
        process.env.FCM_PRIVATE_KEY !== "your_firebase_private_key"
    ) {
        firebaseAdmin.initializeApp({
            credential: firebaseAdmin.credential.cert({
                projectId: process.env.FCM_PROJECT_ID,
                clientEmail: process.env.FCM_CLIENT_EMAIL,
                privateKey: process.env.FCM_PRIVATE_KEY.replace(/\\n/g, "\n"),
            }),
        });
        admin = firebaseAdmin;
        console.log("✅ Firebase initialized");
    } else {
        console.log("⚠️ Firebase not configured — push notifications disabled");
    }
} catch (err) {
    console.log("⚠️ Firebase init failed:", err.message);
}

module.exports = admin;
