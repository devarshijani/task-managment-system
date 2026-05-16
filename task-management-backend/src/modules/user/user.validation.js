const Joi = require("joi");

const createUserValidation = Joi.object({
    name: Joi.string().trim().required().messages({
        "string.empty": "Name is required",
        "any.required": "Name is required",
    }),
    email: Joi.string().email().trim().required().messages({
        "string.email": "Please provide a valid email",
        "any.required": "Email is required",
    }),
    password: Joi.string().min(6).required().messages({
        "string.min": "Password must be at least 6 characters",
        "any.required": "Password is required",
    }),
    role: Joi.string().valid("admin", "user").required().messages({
        "any.only": "Role must be admin or user",
        "any.required": "Role is required",
    }),
    company: Joi.string().required().messages({
        "any.required": "Company is required",
    }),
});

const updateUserValidation = Joi.object({
    name: Joi.string().trim().optional(),
    email: Joi.string().email().trim().optional(),
    role: Joi.string().valid("admin", "user").optional(),
    isActive: Joi.boolean().optional(),
});

module.exports = { createUserValidation, updateUserValidation };