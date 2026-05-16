const jwt = require("jsonwebtoken");
const User = require("../modules/user/user.model");
const Project = require("../modules/project/project.model");
const { saveMessage } = require("../modules/chat/chat.service");
const { sendMultiplePushNotifications } = require("../utils/sendPushNotification");
const { sendNotification } = require("../modules/notification/notification.service");

const initSocket = (io) => {
    // Auth middleware for socket
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) return next(new Error("Authentication error"));

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select("-password");

            if (!user || user.status !== "active") {
                return next(new Error("User not authorized"));
            }

            socket.user = user;
            next();
        } catch (err) {
            next(new Error("Authentication error"));
        }
    });

    io.on("connection", (socket) => {
        console.log(`✅ User connected: ${socket.user.name}`);

        // Join project chat room
        socket.on("join_project", async (projectId) => {
            try {
                const project = await Project.findById(projectId);
                if (!project) return socket.emit("error", "Project not found");

                const hasAccess =
                    socket.user.role === "admin" ||
                    project.assignedUsers.includes(socket.user._id);

                if (!hasAccess) {
                    return socket.emit("error", "Not authorized to join this chat");
                }

                socket.join(projectId);
                console.log(`${socket.user.name} joined project: ${projectId}`);
                socket.emit("joined", { projectId, message: "Joined project chat!" });
            } catch (err) {
                socket.emit("error", err.message);
            }
        });

        // Send message
        socket.on("send_message", async ({ projectId, message }) => {
            try {
                if (!message || !message.trim()) return;

                // Save to DB
                const savedMessage = await saveMessage(
                    projectId,
                    socket.user._id,
                    socket.user.company,
                    message.trim()
                );

                const payload = {
                    _id: savedMessage._id,
                    message: savedMessage.message,
                    sender: {
                        _id: socket.user._id,
                        name: socket.user.name,
                        email: socket.user.email,
                    },
                    projectId,
                    createdAt: savedMessage.createdAt,
                };

                // Broadcast to all users in the project room
                io.to(projectId).emit("receive_message", payload);

                // Get project with assigned users for notifications
                const fullProject = await Project.findById(projectId)
                    .populate("assignedUsers", "fcmToken name _id");

                if (!fullProject) return;

                // Get all users except sender
                const otherUsers = fullProject.assignedUsers.filter(
                    (u) => u._id.toString() !== socket.user._id.toString()
                );

                // Collect valid FCM tokens
                const fcmTokens = otherUsers
                    .map((u) => u.fcmToken)
                    .filter(Boolean);

                // Send push notifications
                if (fcmTokens.length > 0) {
                    await sendMultiplePushNotifications({
                        tokens: fcmTokens,
                        title: `${socket.user.name} in ${fullProject.name}`,
                        body: message.trim().substring(0, 100),
                        data: {
                            projectId,
                            senderName: socket.user.name,
                            projectName: fullProject.name,
                        },
                    });
                }

                // Log notification for each user in DB
                for (const u of otherUsers) {
                    await sendNotification({
                        recipient: u._id,
                        company: socket.user.company,
                        type: "chat_message",
                        title: `${socket.user.name} in ${fullProject.name}`,
                        body: message.trim().substring(0, 100),
                        data: {
                            projectId,
                            senderName: socket.user.name,
                            projectName: fullProject.name,
                        },
                        fcmToken: null, // already sent via sendMultiplePushNotifications
                    });
                }
            } catch (err) {
                socket.emit("error", err.message);
            }
        });

        // Leave project room
        socket.on("leave_project", (projectId) => {
            socket.leave(projectId);
            console.log(`${socket.user.name} left project: ${projectId}`);
        });

        // Disconnect
        socket.on("disconnect", () => {
            console.log(`❌ User disconnected: ${socket.user.name}`);
        });
    });
};

module.exports = initSocket;