const Joi = require("joi");

const createCommentValidation = Joi.object({
    content: Joi.string().trim().required().messages({
        "any.required": "Comment content is required",
        "string.empty": "Comment content cannot be empty",
    }),
    task: Joi.string().required().messages({
        "any.required": "Task ID is required",
    }),
});

const updateCommentValidation = Joi.object({
    content: Joi.string().trim().required().messages({
        "string.empty": "Comment content cannot be empty",
    }),
});

module.exports = { createCommentValidation, updateCommentValidation };