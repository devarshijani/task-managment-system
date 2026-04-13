require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../modules/user/user.model");
const connectDB = require("../config/db");

const seed = async () => {
    await connectDB();

    const existing = await User.findOne({ email: "superadmin@system.com" });
    if (existing) {
        console.log("Superadmin already exists");
        process.exit();
    }

    await User.create({
        name: "Super Admin",
        email: "superadmin@system.com",
        password: "Admin@123",
        role: "superadmin",
        company: null,
    });

    console.log("✅ Superadmin created!");
    console.log("Email: superadmin@system.com");
    console.log("Password: Admin@123");
    process.exit();
};

seed();