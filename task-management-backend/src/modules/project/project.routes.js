const express = require("express");
const router = express.Router();
const projectController = require("./project.controller");
const { authenticate } = require("../../middlewares/auth.middleware");
const { authorize } = require("../../middlewares/rbac.middleware");
const { createProjectValidation, updateProjectValidation } = require("./project.validation");

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
    validate(createProjectValidation),
    projectController.createProject
);

router.get(
    "/",
    authenticate,
    authorize("admin", "user"),
    projectController.getAllProjects
);

router.get(
    "/:id",
    authenticate,
    authorize("admin", "user"),
    projectController.getProjectById
);

router.put(
    "/:id",
    authenticate,
    authorize("admin"),
    validate(updateProjectValidation),
    projectController.updateProject
);

router.delete(
    "/:id",
    authenticate,
    authorize("admin"),
    projectController.deleteProject
);

// Assign users to project
router.post(
    "/:id/assign-users",
    authenticate,
    authorize("admin"),
    projectController.assignUsers
);

module.exports = router;