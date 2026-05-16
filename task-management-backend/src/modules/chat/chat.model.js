const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
    {
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true,
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
            required: true,
        },
        message: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);