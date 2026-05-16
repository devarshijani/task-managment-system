const mongoose = require("mongoose");

const historySchema = new mongoose.Schema(
    {
        task: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task",
            required: true,
        },
        changedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
            required: true,
        },
        previousStatus: {
            type: String,
            required: true,
        },
        newStatus: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("History", historySchema);