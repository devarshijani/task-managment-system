const Joi = require("joi");

const loginValidation = Joi.object({
    email: Joi.string().email().trim().required().messages({
        "string.email": "Please provide a valid email",
        "any.required": "Email is required",
    }),
    password: Joi.string().required().messages({
        "any.required": "Password is required",
    }),
});

const registerValidation = Joi.object({
    // Admin details
    name: Joi.string().trim().required().messages({
        "any.required": "Admin name is required",
    }),
    email: Joi.string().email().trim().required().messages({
        "string.email": "Please provide a valid email",
        "any.required": "Admin email is required",
    }),
    password: Joi.string().min(6).required().messages({
        "string.min": "Password must be at least 6 characters",
        "any.required": "Password is required",
    }),
    // Company details
    companyName: Joi.string().trim().required().messages({
        "any.required": "Company name is required",
    }),
    companyEmail: Joi.string().email().trim().required().messages({
        "any.required": "Company email is required",
    }),
    companyPhone: Joi.string().trim().optional(),
    companyAddress: Joi.string().trim().optional(),
    // Plan
    planId: Joi.string().required().messages({
        "any.required": "Plan is required",
    }),
});

module.exports = { loginValidation, registerValidation };