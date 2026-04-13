const asyncHandler = require("../../utils/asyncHandler");
const sendResponse = require("../../utils/response");
const projectService = require("./project.service");

const createProject = asyncHandler(async (req, res) => {
    const project = await projectService.createProject(req.body, req.user.company);
    return sendResponse(res, 201, true, "Project created successfully", project);
});

const getAllProjects = asyncHandler(async (req, res) => {
    const result = await projectService.getAllProjects(req.query, req.user);
    return sendResponse(res, 200, true, "Projects fetched successfully", result);
});

const getProjectById = asyncHandler(async (req, res) => {
    const project = await projectService.getProjectById(req.params.id, req.user);
    if (!project) return sendResponse(res, 404, false, "Project not found");
    return sendResponse(res, 200, true, "Project fetched successfully", project);
});

const updateProject = asyncHandler(async (req, res) => {
    const project = await projectService.updateProject(req.params.id, req.body);
    if (!project) return sendResponse(res, 404, false, "Project not found");
    return sendResponse(res, 200, true, "Project updated successfully", project);
});

const deleteProject = asyncHandler(async (req, res) => {
    const project = await projectService.deleteProject(req.params.id);
    if (!project) return sendResponse(res, 404, false, "Project not found");
    return sendResponse(res, 200, true, "Project deleted successfully", null);
});

const assignUsers = asyncHandler(async (req, res) => {
    const project = await projectService.assignUsers(
        req.params.id,
        req.body.userIds
    );
    if (!project) return sendResponse(res, 404, false, "Project not found");
    return sendResponse(res, 200, true, "Users assigned successfully", project);
});

module.exports = {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject,
    assignUsers,
};