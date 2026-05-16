const express = require("express");
const router = express.Router();
const taskController = require("./task.controller");
const { authenticate } = require("../../middlewares/auth.middleware");
const { authorize } = require("../../middlewares/rbac.middleware");
const { createTaskValidation, updateTaskValidation } = require("./task.validation");

const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        const messages = error.details.map((d) => d.message).join(", ");
        return res.status(400).json({ success: false, message: messages });
    }
    next();
};

router.post(
    "/",
    authenticate,
    authorize("admin"),
    validate(createTaskValidation),
    taskController.createTask
);

router.get(
    "/",
    authenticate,
    authorize("admin", "user"),
    taskController.getAllTasks
);

router.get(
    "/:id",
    authenticate,
    authorize("admin", "user"),
    taskController.getTaskById
);

router.put(
    "/:id",
    authenticate,
    authorize("admin", "user"),
    validate(updateTaskValidation),
    taskController.updateTask
);

router.delete(
    "/:id",
    authenticate,
    authorize("admin"),
    taskController.deleteTask
);

module.exports = router;