const Joi = require("joi");

const createPlanValidation = Joi.object({
    name: Joi.string().trim().required().messages({
        "any.required": "Plan name is required",
    }),
    maxProjects: Joi.number().integer().min(1).required().messages({
        "any.required": "Max projects is required",
    }),
    maxUsers: Joi.number().integer().min(1).required().messages({
        "any.required": "Max users is required",
    }),
    durationInDays: Joi.number().integer().min(1).required().messages({
        "any.required": "Duration is required",
    }),
    price: Joi.number().min(0).required().messages({
        "any.required": "Price is required",
    }),
});

const updatePlanValidation = Joi.object({
    name: Joi.string().trim().optional(),
    maxProjects: Joi.number().integer().min(1).optional(),
    maxUsers: Joi.number().integer().min(1).optional(),
    durationInDays: Joi.number().integer().min(1).optional(),
    price: Joi.number().min(0).optional(),
    isActive: Joi.boolean().optional(),
});

module.exports = { createPlanValidation, updatePlanValidation };