const User = require("./user.model");
const Company = require("../company/company.model");
const paginate = require("../../utils/pagination");
const { sendEmail } = require("../../emails/mailer");
const { welcomeUserEmail } = require("../../emails/templates/welcomeUser");

// Create user
const createUser = async (data, companyId) => {
    // Get company with plan
    const company = await Company.findById(companyId).populate("plan");
    if (!company) throw new Error("Company not found");
    if (!company.plan) throw new Error("No active plan found for company");

    // Check plan user limit
    const userCount = await User.countDocuments({
        company: companyId,
        status: "active",
    });

    if (userCount >= company.plan.maxUsers) {
        throw new Error(
            `User limit reached. Your plan allows only ${company.plan.maxUsers} users`
        );
    }

    const user = await User.create({ ...data, status: "active", company: companyId });
    await sendEmail({
        to: data.email,
        subject: "Welcome to Task Management System",
        html: welcomeUserEmail(user.name, user.email, data.password),
    });
    return user;
};

// Get all users with pagination
const getAllUsers = async (query, companyId, role) => {
    const { page, limit, skip } = paginate(query);
    const filter = { status: "active" };

    if (role !== "superadmin") {
        filter.company = companyId;
    }

    if (query.company) filter.company = query.company;
    if (query.search) filter.name = { $regex: query.search, $options: "i" };
    if (query.role) filter.role = query.role;

    const sortField = query.sortBy || "createdAt";
    const sortOrder = query.sortOrder === "asc" ? 1 : -1;

    const [users, total] = await Promise.all([
        User.find(filter)
            .populate("company", "name email")
            .skip(skip)
            .limit(limit)
            .sort({ [sortField]: sortOrder }),
        User.countDocuments(filter),
    ]);

    return {
        users,
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
};

// Get single user
const getUserById = async (id) => {
    return await User.findById(id).populate("company", "name email");
};

// Update user
const updateUser = async (id, data) => {
    return await User.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    }).populate("company", "name email");
};

// Soft delete user
const deleteUser = async (id) => {
    return await User.findByIdAndUpdate(
        id,
        { status: "inactive" },
        { new: true }
    );
};

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
};