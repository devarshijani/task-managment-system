const crypto = require("crypto");
const asyncHandler = require("../../utils/asyncHandler");
const sendResponse = require("../../utils/response");
const Company = require("../company/company.model");
const User = require("../user/user.model");
const Plan = require("../plan/plan.model");

const razorpayWebhook = asyncHandler(async (req, res) => {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // Step 1 — Verify HMAC signature
    const signature = req.headers["x-razorpay-signature"];

    const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(JSON.stringify(req.body))
        .digest("hex");

    if (signature !== expectedSignature) {
        return sendResponse(res, 400, false, "Invalid webhook signature");
    }

    const event = req.body.event;
    const payload = req.body.payload;

    // Step 2 — Handle payment_link.paid (success)
    if (event === "payment_link.paid") {
        const paymentLinkId = payload.payment_link.entity.id;
        const notes = payload.payment_link.entity.notes;

        const { companyId, userId, planId } = notes;

        // Find plan
        const plan = await Plan.findById(planId);
        if (!plan) {
            return sendResponse(res, 404, false, "Plan not found");
        }

        // Calculate expiry date
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + plan.durationInDays);

        // Activate company
        await Company.findByIdAndUpdate(companyId, {
            status: "active",
            plan: planId,
            planExpiresAt: expiryDate,
        });

        // Activate user
        await User.findByIdAndUpdate(userId, {
            status: "active",
        });

        console.log(`✅ Payment success for company: ${companyId}`);
        return sendResponse(res, 200, true, "Webhook processed successfully");
    }

    // Step 3 — Handle payment_link.cancelled or payment.failed
    if (
        event === "payment_link.cancelled" ||
        event === "payment.failed"
    ) {
        const notes =
            event === "payment_link.cancelled"
                ? payload.payment_link.entity.notes
                : payload.payment.entity.notes;

        const { companyId } = notes;

        // Mark company as payment_failed
        await Company.findByIdAndUpdate(companyId, {
            status: "payment_failed",
        });

        console.log(`❌ Payment failed for company: ${companyId}`);
        return sendResponse(res, 200, true, "Webhook processed");
    }

    // Other events — just acknowledge
    return sendResponse(res, 200, true, "Webhook received");
});

module.exports = { razorpayWebhook };