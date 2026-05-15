const admin = require("firebase-admin");

const firebaseApp = admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.FCM_PROJECT_ID,
        clientEmail: process.env.FCM_CLIENT_EMAIL,
        privateKey: process.env.FCM_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
});

module.exports = admin;