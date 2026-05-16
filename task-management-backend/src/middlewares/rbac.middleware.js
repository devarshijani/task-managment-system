const sendResponse = require("../utils/response");

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return sendResponse(
                res,
                403,
                false,
                `Role '${req.user.role}' is not authorized to access this route`
            );
        }
        next();
    };
};

module.exports = { authorize };