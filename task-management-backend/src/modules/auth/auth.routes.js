const express = require("express");
const router = express.Router();
const authController = require("./auth.controller");
const { authenticate } = require("../../middlewares/auth.middleware");
const { loginValidation, registerValidation } = require("./auth.validation");

const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        const messages = error.details.map((d) => d.message).join(", ");
        return res.status(400).json({ success: false, message: messages });
    }
    next();
};

router.post("/login", validate(loginValidation), authController.login);
router.post("/register", validate(registerValidation), authController.register);
router.put(
    "/change-password",
    authenticate,
    authController.changePassword
);

module.exports = router;