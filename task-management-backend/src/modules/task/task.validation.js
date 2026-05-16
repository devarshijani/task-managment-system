const Joi = require("joi");

const createTaskValidation = Joi.object({
    title: Joi.string().trim().required().messages({
        "any.required": "Task title is required",
    }),
    description: Joi.string().trim().optional(),
    project: Joi.string().required().messages({
        "any.required": "Project is required",
    }),
    assignedTo: Joi.string().optional(),
    reportTo: Joi.string().optional(),
    priority: Joi.string().valid("high", "medium", "low").optional(),
    status: Joi.string()
        .valid(
            "to-do",
            "in-progress",
            "done",
            "testing",
            "qa-verified",
            "re-open",
            "deployment"
        )
        .optional(),
    dueDate: Joi.date().optional(),
});

const updateTaskValidation = Joi.object({
    title: Joi.string().trim().optional(),
    description: Joi.string().trim().optional(),
    assignedTo: Joi.string().optional(),
    reportTo: Joi.string().optional(),
    priority: Joi.string().valid("high", "medium", "low").optional(),
    status: Joi.string()
        .valid(
            "to-do",
            "in-progress",
            "done",
            "testing",
            "qa-verified",
            "re-open",
            "deployment"
        )
        .optional(),
    dueDate: Joi.date().optional(),
});

module.exports = { createTaskValidation, updateTaskValidation };