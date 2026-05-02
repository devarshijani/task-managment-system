const asyncHandler = require("../../utils/asyncHandler");
const sendResponse = require("../../utils/response");
const authService = require("./auth.service");

const login = asyncHandler(async (req, res) => {
    const { email, password, fcmToken } = req.body;
    const { user, token } = await authService.login(email, password, fcmToken);
    return sendResponse(res, 200, true, "Login successful", { user, token });
});

const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    await authService.changePassword(req.user._id, currentPassword, newPassword);
    return sendResponse(res, 200, true, "Password changed successfully");
});

const register = asyncHandler(async (req, res) => {
    const result = await authService.register(req.body);
    return sendResponse(res, 201, true, result.message, {
        checkoutUrl: result.checkoutUrl,
        companyId: result.companyId,
        userId: result.userId,
    });
});

module.exports = { login, register, changePassword };