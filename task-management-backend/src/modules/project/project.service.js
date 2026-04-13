const Project = require("./project.model");
const Company = require("../company/company.model");
const Plan = require("../plan/plan.model");
const paginate = require("../../utils/pagination");

// Create project
const createProject = async (data, companyId) => {
    // Get company with plan
    const company = await Company.findById(companyId).populate("plan");
    if (!company) throw new Error("Company not found");
    if (!company.plan) throw new Error("No active plan found for company");

    // Check plan project limit
    const projectCount = await Project.countDocuments({ company: companyId });
    if (projectCount >= company.plan.maxProjects) {
        throw new Error(
            `Project limit reached. Your plan allows only ${company.plan.maxProjects} projects`
        );
    }

    const project = await Project.create({
        ...data,
        company: companyId,
    });

    return project;
};

// Get all projects
const getAllProjects = async (query, user) => {
    const { page, limit, skip } = paginate(query);
    const filter = { status: "active" };

    // Admin sees all company projects, user sees only assigned projects
    if (user.role === "admin") {
        filter.company = user.company;
    } else if (user.role === "user") {
        filter.assignedUsers = user._id;
        filter.company = user.company;
    }

    // Search by name
    if (query.search) {
        filter.name = { $regex: query.search, $options: "i" };
    }

    // Filter by status
    if (query.status) {
        filter.status = query.status;
    }

    const [projects, total] = await Promise.all([
        Project.find(filter)
            .populate("assignedUsers", "name email")
            .populate("company", "name")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }),
        Project.countDocuments(filter),
    ]);

    return {
        projects,
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
};

// Get single project
const getProjectById = async (id, user) => {
    const project = await Project.findById(id)
        .populate("assignedUsers", "name email")
        .populate("company", "name");

    if (!project) return null;

    // User can only access assigned projects
    if (user.role === "user") {
        const isAssigned = project.assignedUsers.some(
            (u) => u._id.toString() === user._id.toString()
        );
        if (!isAssigned) throw new Error("Not authorized to access this project");
    }

    // Admin can only access own company projects
    if (user.role === "admin") {
        if (project.company._id.toString() !== user.company.toString()) {
            throw new Error("Not authorized to access this project");
        }
    }

    return project;
};

// Update project
const updateProject = async (id, data) => {
    return await Project.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    }).populate("assignedUsers", "name email");
};

// Soft delete project
const deleteProject = async (id) => {
    return await Project.findByIdAndUpdate(
        id,
        { status: "inactive" },
        { new: true }
    );
};

// Assign users to project
const assignUsers = async (projectId, userIds) => {
    const project = await Project.findByIdAndUpdate(
        projectId,
        { assignedUsers: userIds },
        { new: true }
    ).populate("assignedUsers", "name email");
    return project;
};

module.exports = {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject,
    assignUsers,
};