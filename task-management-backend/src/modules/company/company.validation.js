const Joi = require("joi");

const createCompanyValidation = Joi.object({
    name: Joi.string().trim().required().messages({
        "string.empty": "Company name is required",
        "any.required": "Company name is required",
    }),
    email: Joi.string().email().trim().required().messages({
        "string.email": "Please provide a valid email",
        "any.required": "Company email is required",
    }),
    phone: Joi.string().trim().optional(),
    address: Joi.string().trim().optional(),
});

const updateCompanyValidation = Joi.object({
    name: Joi.string().trim().optional(),
    email: Joi.string().email().trim().optional(),
    phone: Joi.string().trim().optional(),
    address: Joi.string().trim().optional(),
    isActive: Joi.boolean().optional(),
});

module.exports = { createCompanyValidation, updateCompanyValidation };