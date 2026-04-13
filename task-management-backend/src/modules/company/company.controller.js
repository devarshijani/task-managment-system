const asyncHandler = require("../../utils/asyncHandler");
const sendResponse = require("../../utils/response");
const companyService = require("./company.service");

// Create company
const createCompany = asyncHandler(async (req, res) => {
    const company = await companyService.createCompany(req.body);
    return sendResponse(res, 201, true, "Company created successfully", company);
});

// Get all companies
const getAllCompanies = asyncHandler(async (req, res) => {
    const result = await companyService.getAllCompanies(req.query);
    return sendResponse(res, 200, true, "Companies fetched successfully", result);
});

// Get single company
const getCompanyById = asyncHandler(async (req, res) => {
    const company = await companyService.getCompanyById(req.params.id);
    if (!company) {
        return sendResponse(res, 404, false, "Company not found");
    }
    return sendResponse(res, 200, true, "Company fetched successfully", company);
});

// Update company
const updateCompany = asyncHandler(async (req, res) => {
    const company = await companyService.updateCompany(req.params.id, req.body);
    if (!company) {
        return sendResponse(res, 404, false, "Company not found");
    }
    return sendResponse(res, 200, true, "Company updated successfully", company);
});

// Delete company
const deleteCompany = asyncHandler(async (req, res) => {
    const company = await companyService.deleteCompany(req.params.id);
    if (!company) {
        return sendResponse(res, 404, false, "Company not found");
    }
    return sendResponse(res, 200, true, "Company deleted successfully", null);
});

module.exports = {
    createCompany,
    getAllCompanies,
    getCompanyById,
    updateCompany,
    deleteCompany,
};