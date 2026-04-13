const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Company name is required"],
            trim: true,
            unique: true,
        },
        email: {
            type: String,
            required: [true, "Company email is required"],
            trim: true,
            lowercase: true,
            unique: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        address: {
            type: String,
            trim: true,
        },
        status: {
            type: String,
            enum: ["pending", "active", "inactive", "payment_failed"],
            default: "pending",
        },
        plan: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Plan",
            default: null,
        },
        planExpiresAt: {
            type: Date,
            default: null,
        },
        paymentLinkId: {
            type: String,
            default: null,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Company", companySchema);