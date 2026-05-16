const asyncHandler = require("../../utils/asyncHandler");
const sendResponse = require("../../utils/response");
const planService = require("./plan.service");

const createPlan = asyncHandler(async (req, res) => {
    const plan = await planService.createPlan(req.body);
    return sendResponse(res, 201, true, "Plan created successfully", plan);
});

const getAllPlans = asyncHandler(async (req, res) => {
    const result = await planService.getAllPlans(req.query);
    return sendResponse(res, 200, true, "Plans fetched successfully", result);
});

const getPlanById = asyncHandler(async (req, res) => {
    const plan = await planService.getPlanById(req.params.id);
    if (!plan) return sendResponse(res, 404, false, "Plan not found");
    return sendResponse(res, 200, true, "Plan fetched successfully", plan);
});

const updatePlan = asyncHandler(async (req, res) => {
    const plan = await planService.updatePlan(req.params.id, req.body);
    if (!plan) return sendResponse(res, 404, false, "Plan not found");
    return sendResponse(res, 200, true, "Plan updated successfully", plan);
});

const deletePlan = asyncHandler(async (req, res) => {
    const plan = await planService.deletePlan(req.params.id);
    if (!plan) return sendResponse(res, 404, false, "Plan not found");
    return sendResponse(res, 200, true, "Plan deleted successfully", null);
});

module.exports = { createPlan, getAllPlans, getPlanById, updatePlan, deletePlan };