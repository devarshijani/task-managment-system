const express = require("express");
const router = express.Router();
const commentController = require("./comment.controller");
const { authenticate } = require("../../middlewares/auth.middleware");
const { authorize } = require("../../middlewares/rbac.middleware");
const {
    createCommentValidation,
    updateCommentValidation,
} = require("./comment.validation");

const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        const messages = error.details.map((d) => d.message).join(", ");
        return res.status(400).json({ success: false, message: messages });
    }
    next();
};

// Add comment
router.post(
    "/",
    authenticate,
    authorize("admin", "user"),
    validate(createCommentValidation),
    commentController.createComment
);

// Get comments by task
router.get(
    "/task/:taskId",
    authenticate,
    authorize("admin", "user"),
    commentController.getCommentsByTask
);

// Update comment
router.put(
    "/:id",
    authenticate,
    authorize("admin", "user"),
    validate(updateCommentValidation),
    commentController.updateComment
);

// Delete comment
router.delete(
    "/:id",
    authenticate,
    authorize("admin", "user"),
    commentController.deleteComment
);

module.exports = router;