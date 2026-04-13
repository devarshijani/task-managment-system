const asyncHandler = require("../../utils/asyncHandler");
const sendResponse = require("../../utils/response");
const commentService = require("./comment.service");

const createComment = asyncHandler(async (req, res) => {
    const comment = await commentService.createComment(req.body, req.user);
    return sendResponse(res, 201, true, "Comment added successfully", comment);
});

const getCommentsByTask = asyncHandler(async (req, res) => {
    const result = await commentService.getCommentsByTask(
        req.params.taskId,
        req.query,
        req.user
    );
    return sendResponse(res, 200, true, "Comments fetched successfully", result);
});

const updateComment = asyncHandler(async (req, res) => {
    const comment = await commentService.updateComment(
        req.params.id,
        req.body.content,
        req.user._id
    );
    if (!comment) return sendResponse(res, 404, false, "Comment not found");
    return sendResponse(res, 200, true, "Comment updated successfully", comment);
});

const deleteComment = asyncHandler(async (req, res) => {
    const comment = await commentService.deleteComment(
        req.params.id,
        req.user._id,
        req.user.role
    );
    if (!comment) return sendResponse(res, 404, false, "Comment not found");
    return sendResponse(res, 200, true, "Comment deleted successfully", null);
});

module.exports = {
    createComment,
    getCommentsByTask,
    updateComment,
    deleteComment,
};