const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
    {
        taskId: {
            type: String,
            unique: true,
        },
        title: {
            type: String,
            required: [true, "Task title is required"],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true,
        },
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
            required: true,
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        reportTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        priority: {
            type: String,
            enum: ["high", "medium", "low"],
            default: "medium",
        },
        dueDate: {
            type: Date,
            default: null,
        },
        status: {
            type: String,
            enum: [
                "to-do",
                "in-progress",
                "done",
                "testing",
                "qa-verified",
                "re-open",
                "deployment",
            ],
            default: "to-do",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);