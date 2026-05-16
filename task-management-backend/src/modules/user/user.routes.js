const express = require("express");
const router = express.Router();
const userController = require("./user.controller");
const { authenticate } = require("../../middlewares/auth.middleware");
const { authorize } = require("../../middlewares/rbac.middleware");
const {
    createUserValidation,
    updateUserValidation,
} = require("./user.validation");

const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        const messages = error.details.map((d) => d.message).join(", ");
        return res.status(400).json({ success: false, message: messages });
    }
    next();
};

// superadmin can do everything, admin can create and list users
router.post(
    "/",
    authenticate,
    authorize("superadmin", "admin"),
    validate(createUserValidation),
    userController.createUser
);

router.get(
    "/",
    authenticate,
    authorize("superadmin", "admin"),
    userController.getAllUsers
);

router.get(
    "/:id",
    authenticate,
    authorize("superadmin", "admin"),
    userController.getUserById
);

router.put(
    "/:id",
    authenticate,
    authorize("superadmin", "admin"),
    validate(updateUserValidation),
    userController.updateUser
);

router.delete(
    "/:id",
    authenticate,
    authorize("superadmin", "admin"),
    userController.deleteUser
);

module.exports = router;