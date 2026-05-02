const jwt = require("jsonwebtoken");
const User = require("../user/user.model");
const Company = require("../company/company.model");
const Plan = require("../plan/plan.model");
const razorpay = require("../../utils/razorpay");

// Login
const login = async (email, password, fcmToken = null) => {
    const user = await User.findOne({ email })
        .select("+password")
        .populate("company");

    if (!user) throw new Error("Invalid credentials");

    if (user.status === "inactive") {
        throw new Error("Your account is inactive. Please complete payment first");
    }

    if (user.role !== "superadmin") {
        if (!user.company) throw new Error("Company not found");
        if (user.company.status === "pending") throw new Error("Company is pending. Please complete payment first");
        if (user.company.status === "payment_failed") throw new Error("Payment failed. Please contact support");
        if (user.company.status === "inactive") throw new Error("Company is inactive. Please contact support");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new Error("Invalid credentials");

    // Save FCM token if provided
    if (fcmToken) {
        await User.findByIdAndUpdate(user._id, { fcmToken });
    }

    const token = jwt.sign(
        { id: user._id, role: user.role, company: user.company?._id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    user.password = undefined;
    return { user, token };
};

const changePassword = async (userId, currentPassword, newPassword) => {
    const user = await User.findById(userId).select("+password");
    if (!user) throw new Error("User not found");

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) throw new Error("Current password is incorrect");

    user.password = newPassword;
    await user.save();
    return true;
};

// Register admin + company + create razorpay payment link
const register = async (data) => {
    const {
        name, email, password,
        companyName, companyEmail, companyPhone, companyAddress,
        planId,
    } = data;

    // Check if plan exists
    const plan = await Plan.findById(planId);
    if (!plan) throw new Error("Selected plan not found");

    // Check if user email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error("Email already registered");

    // Check if company email already exists
    const existingCompany = await Company.findOne({ email: companyEmail });
    if (existingCompany) throw new Error("Company email already registered");

    // Create company with pending status
    const company = await Company.create({
        name: companyName,
        email: companyEmail,
        phone: companyPhone,
        address: companyAddress,
        status: "pending",
        plan: planId,
    });

    // Create admin user with inactive status
    const user = await User.create({
        name,
        email,
        password,
        role: "admin",
        company: company._id,
        status: "inactive",
    });

    // Create Razorpay payment link
    const paymentLink = await razorpay.paymentLink.create({
        amount: plan.price * 100, // Razorpay expects paise
        currency: "INR",
        accept_partial: false,
        description: `Subscription for ${plan.name} plan`,
        customer: {
            name,
            email,
        },
        notify: {
            sms: false,
            email: true,
        },
        reminder_enable: false,
        notes: {
            companyId: company._id.toString(),
            userId: user._id.toString(),
            planId: plan._id.toString(),
        },
        callback_url: `${process.env.FRONTEND_URL}/payment-success`,
        callback_method: "get",
    });



    // Save payment link id in company
    company.paymentLinkId = paymentLink.id;
    await company.save();

    return {
        message: "Registration successful. Please complete payment.",
        checkoutUrl: paymentLink.short_url,
        companyId: company._id,
        userId: user._id,
    };
};

module.exports = { login, register, changePassword };