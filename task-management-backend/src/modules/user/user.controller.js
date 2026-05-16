const asyncHandler = require("../../utils/asyncHandler");
const sendResponse = require("../../utils/response");
const userService = require("./user.service");

const createUser = asyncHandler(async (req, res) => {
    const user = await userService.createUser(req.body, req.user.company);
    return sendResponse(res, 201, true, "User created successfully", user);
});

const getAllUsers = asyncHandler(async (req, res) => {
    const result = await userService.getAllUsers(
        req.query,
        req.user.company,
        req.user.role
    );
    return sendResponse(res, 200, true, "Users fetched successfully", result);
});

const getUserById = asyncHandler(async (req, res) => {
    const user = await userService.getUserById(req.params.id);
    if (!user) return sendResponse(res, 404, false, "User not found");
    return sendResponse(res, 200, true, "User fetched successfully", user);
});

const updateUser = asyncHandler(async (req, res) => {
    const user = await userService.updateUser(req.params.id, req.body);
    if (!user) return sendResponse(res, 404, false, "User not found");
    return sendResponse(res, 200, true, "User updated successfully", user);
});

const deleteUser = asyncHandler(async (req, res) => {
    const user = await userService.deleteUser(req.params.id);
    if (!user) return sendResponse(res, 404, false, "User not found");
    return sendResponse(res, 200, true, "User deleted successfully", null);
});

module.exports = { createUser, getAllUsers, getUserById, updateUser, deleteUser };