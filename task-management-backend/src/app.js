const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const errorHandler = require("./middlewares/error.middleware");
const companyRoutes = require("./modules/company/company.routes");
const authRoutes = require("./modules/auth/auth.routes");
const userRoutes = require("./modules/user/user.routes");
const planRoutes = require("./modules/plan/plan.routes");
const projectRoutes = require("./modules/project/project.routes");
const webhookRoutes = require("./modules/webhook/webhook.routes");
const taskRoutes = require("./modules/task/task.routes");
const historyRoutes = require("./modules/history/history.routes");
const commentRoutes = require("./modules/comment/comment.routes");
const chatRoutes = require("./modules/chat/chat.routes");
const notificationRoutes = require("./modules/notification/notification.routes");


const app = express();

// Security & utility middlewares
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));

app.use("/api/webhooks", webhookRoutes);

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/users", userRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/notifications", notificationRoutes);

// TEMP TEST ROUTE
app.post("/api/test/activate", async (req, res) => {
    const Company = require("./modules/company/company.model");
    const User = require("./modules/user/user.model");
    const Plan = require("./modules/plan/plan.model");

    const { companyId, userId, planId } = req.body;
    const plan = await Plan.findById(planId);

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + plan.durationInDays);

    await Company.findByIdAndUpdate(companyId, {
        status: "active",
        plan: planId,
        planExpiresAt: expiryDate,
    });

    await User.findByIdAndUpdate(userId, { status: "active" });

    res.json({ success: true, message: "Activated!" });
});

// Health check route
app.get("/", (req, res) => {
    res.json({ success: true, message: "Task Management API is running" });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
});

// Centralized error handler (must be last)
app.use(errorHandler);

module.exports = app;
