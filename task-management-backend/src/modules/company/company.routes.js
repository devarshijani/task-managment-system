const express = require("express");
const router = express.Router();
const companyController = require("./company.controller");
const { authenticate } = require("../../middlewares/auth.middleware");
const { authorize } = require("../../middlewares/rbac.middleware");
const {
    createCompanyValidation,
    updateCompanyValidation,
} = require("./company.validation");

// Validation middleware
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
    authorize("superadmin"),
    validate(createCompanyValidation),
    companyController.createCompany
);

router.get(
    "/",
    authenticate,
    authorize("superadmin"),
    companyController.getAllCompanies
);

router.get(
    "/:id",
    authenticate,
    authorize("superadmin"),
    companyController.getCompanyById
);

router.put(
    "/:id",
    authenticate,
    authorize("superadmin"),
    validate(updateCompanyValidation),
    companyController.updateCompany
);

router.delete(
    "/:id",
    authenticate,
    authorize("superadmin"),
    companyController.deleteCompany
);

module.exports = router;