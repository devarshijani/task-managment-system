const sendResponse = require("../utils/response");

const errorHandler = (err, req, res, next) => {
    console.error(`Error: ${err.message}`);

    // Mongoose validation error
    if (err.name === "ValidationError") {
        const messages = Object.values(err.errors).map((e) => e.message);
        return sendResponse(res, 400, false, messages.join(", "));
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return sendResponse(res, 400, false, `${field} already exists`);
    }

    // JWT errors
    if (err.name === "JsonWebTokenError") {
        return sendResponse(res, 401, false, "Invalid token");
    }

    if (err.name === "TokenExpiredError") {
        return sendResponse(res, 401, false, "Token expired");
    }

    // Default server error
    return sendResponse(
        res,
        err.statusCode || 500,
        false,
        err.message || "Internal server error"
    );
};

module.exports = errorHandler;