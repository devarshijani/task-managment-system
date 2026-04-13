const Joi = require("joi");

const createProjectValidation = Joi.object({
    name: Joi.string().trim().required().messages({
        "any.required": "Project name is required",
    }),
    description: Joi.string().trim().optional(),
    shortCode: Joi.string().trim().uppercase().required().messages({
        "any.required": "Short code is required",
    }),
    assignedUsers: Joi.array().items(Joi.string()).optional(),
});

const updateProjectValidation = Joi.object({
    name: Joi.string().trim().optional(),
    description: Joi.string().trim().optional(),
    shortCode: Joi.string().trim().uppercase().optional(),
    assignedUsers: Joi.array().items(Joi.string()).optional(),
    status: Joi.string().valid("active", "inactive").optional(),
});

module.exports = { createProjectValidation, updateProjectValidation };