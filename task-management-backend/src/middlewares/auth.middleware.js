const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/response");
const User = require("../modules/user/user.model");

const authenticate = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return sendResponse(res, 401, false, "Not authorized, no token");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user || user.status !== "active") {
        return sendResponse(res, 401, false, "Not authorized, user not found");
    }

    req.user = user;
    next();
});

module.exports = { authenticate };