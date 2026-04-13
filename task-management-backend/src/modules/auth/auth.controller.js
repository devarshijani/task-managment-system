const asyncHandler = require("../../utils/asyncHandler");
const sendResponse = require("../../utils/response");
const authService = require("./auth.service");

const login = asyncHandler(async (req, res) => {
    const { email, password, fcmToken } = req.body;
    const { user, token } = await authService.login(email, password, fcmToken);
    return sendResponse(res, 200, true, "Login successful", { user, token });
});

const register = asyncHandler(async (req, res) => {
    const result = await authService.register(req.body);
    return sendResponse(res, 201, true, result.message, {
        checkoutUrl: result.checkoutUrl,
        companyId: result.companyId,
        userId: result.userId,
    });
});

module.exports = { login, register };