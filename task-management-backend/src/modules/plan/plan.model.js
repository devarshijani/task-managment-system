const mongoose = require("mongoose");

const planSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Plan name is required"],
            trim: true,
            unique: true,
        },
        maxProjects: {
            type: Number,
            required: [true, "Max projects is required"],
        },
        maxUsers: {
            type: Number,
            required: [true, "Max users is required"],
        },
        durationInDays: {
            type: Number,
            required: [true, "Duration is required"],
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Plan", planSchema);