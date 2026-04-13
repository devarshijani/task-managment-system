const asyncHandler = require("../../utils/asyncHandler");
const sendResponse = require("../../utils/response");
const taskService = require("./task.service");

const createTask = asyncHandler(async (req, res) => {
    const task = await taskService.createTask(req.body, req.user);
    return sendResponse(res, 201, true, "Task created successfully", task);
});

const getAllTasks = asyncHandler(async (req, res) => {
    const result = await taskService.getAllTasks(req.query, req.user);
    return sendResponse(res, 200, true, "Tasks fetched successfully", result);
});

const getTaskById = asyncHandler(async (req, res) => {
    const task = await taskService.getTaskById(req.params.id, req.user);
    if (!task) return sendResponse(res, 404, false, "Task not found");
    return sendResponse(res, 200, true, "Task fetched successfully", task);
});

const updateTask = asyncHandler(async (req, res) => {
    const task = await taskService.updateTask(req.params.id, req.body, req.user);
    if (!task) return sendResponse(res, 404, false, "Task not found");
    return sendResponse(res, 200, true, "Task updated successfully", task);
});

const deleteTask = asyncHandler(async (req, res) => {
    const task = await taskService.deleteTask(req.params.id);
    if (!task) return sendResponse(res, 404, false, "Task not found");
    return sendResponse(res, 200, true, "Task deleted successfully", null);
});

module.exports = { createTask, getAllTasks, getTaskById, updateTask, deleteTask };