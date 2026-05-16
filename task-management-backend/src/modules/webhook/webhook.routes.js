const express = require("express");
const router = express.Router();
const { razorpayWebhook } = require("./webhook.controller");

router.post("/razorpay", razorpayWebhook);

module.exports = router;