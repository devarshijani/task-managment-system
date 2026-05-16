const Task = require("./task.model");
const Project = require("../project/project.model");
const generateTaskId = require("../../utils/generateTaskId");
const paginate = require("../../utils/pagination");
const { createHistory } = require("../history/history.service");
const { sendEmail } = require("../../emails/mailer");
const { taskAssignedEmail } = require("../../emails/templates/taskAssigned");
const { sendNotification } = require("../notification/notification.service");
const User = require("../user/user.model");


// Create task
const createTask = async (data, user) => {
    // Check project exists and belongs to company
    const project = await Project.findById(data.project);
    if (!project) throw new Error("Project not found");

    if (project.company.toString() !== user.company.toString()) {
        throw new Error("Not authorized to create task in this project");
    }
    if (populatedTask.assignedTo) {
        // Send push notification
        await sendNotification({
            recipient: populatedTask.assignedTo._id,
            company: user.company,
            type: "task_assigned",
            title: `New Task: ${populatedTask.taskId}`,
            body: `You have been assigned "${populatedTask.title}" with ${populatedTask.priority} priority`,
            data: {
                taskId: populatedTask.taskId,
                taskTitle: populatedTask.title,
                priority: populatedTask.priority,
            },
            fcmToken: populatedTask.assignedTo.fcmToken,
        });
    }

    // Generate task ID using project short code
    const taskId = await generateTaskId(project.shortCode);

    const task = await Task.create({
        ...data,
        taskId,
        company: user.company,
    });

    const populatedTask = await task.populate([
        { path: "assignedTo", select: "name email" },
        { path: "reportTo", select: "name email" },
        { path: "project", select: "name shortCode" },
    ]);

    // Send email notification to assigned user
    if (populatedTask.assignedTo?.email) {
        const emailContent = taskAssignedEmail(
            populatedTask.assignedTo,
            populatedTask,
            user
        );

        await sendEmail(
            populatedTask.assignedTo.email,
            "New Task Assigned: " + populatedTask.title,
            emailContent
        );
    }

    return populatedTask;

    return task.populate([
        { path: "assignedTo", select: "name email" },
        { path: "reportTo", select: "name email" },
        { path: "project", select: "name shortCode" },
    ]);
};

// Get all tasks
const getAllTasks = async (query, user) => {
    const { page, limit, skip } = paginate(query);
    const filter = { company: user.company };

    // User can only see tasks assigned to them
    if (user.role === "user") {
        filter.assignedTo = user._id;
    }

    // Filter by project
    if (query.project) filter.project = query.project;

    // Filter by status
    if (query.status) filter.status = query.status;

    // Filter by priority
    if (query.priority) filter.priority = query.priority;

    // Search by title
    if (query.search) {
        filter.title = { $regex: query.search, $options: "i" };
    }

    // Sorting
    const sortField = query.sortBy || "createdAt";
    const sortOrder = query.sortOrder === "asc" ? 1 : -1;
    const sort = { [sortField]: sortOrder };

    const [tasks, total] = await Promise.all([
        Task.find(filter)
            .populate("assignedTo", "name email")
            .populate("reportTo", "name email")
            .populate("project", "name shortCode")
            .skip(skip)
            .limit(limit)
            .sort(sort),
        Task.countDocuments(filter),
    ]);

    return {
        tasks,
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
};

// Get single task
const getTaskById = async (id, user) => {
    const task = await Task.findById(id)
        .populate("assignedTo", "name email")
        .populate("reportTo", "name email")
        .populate("project", "name shortCode");

    if (!task) return null;

    // Company isolation
    if (task.company.toString() !== user.company.toString()) {
        throw new Error("Not authorized to access this task");
    }

    // User can only see assigned tasks
    if (user.role === "user") {
        if (task.assignedTo?._id.toString() !== user._id.toString()) {
            throw new Error("Not authorized to access this task");
        }
    }

    return task;
};

// Update task
const updateTask = async (id, data, user) => {
    const task = await Task.findById(id);
    if (!task) return null;

    if (task.company.toString() !== user.company.toString()) {
        throw new Error("Not authorized to update this task");
    }

    if (user.role === "user") {
        if (task.assignedTo?.toString() !== user._id.toString()) {
            throw new Error("Not authorized to update this task");
        }

        // Track status change
        if (data.status && data.status !== task.status) {
            await createHistory(
                task._id,
                user._id,
                user.company,
                task.status,
                data.status
            );
        }

        return await Task.findByIdAndUpdate(
            id,
            { status: data.status },
            { new: true, runValidators: true }
        ).populate("assignedTo", "name email");
    }

    // Admin — track status change if status changed
    if (data.status && data.status !== task.status) {
        await createHistory(
            task._id,
            user._id,
            user.company,
            task.status,
            data.status
        );
    }

    return await Task.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    }).populate([
        { path: "assignedTo", select: "name email" },
        { path: "reportTo", select: "name email" },
        { path: "project", select: "name shortCode" },
    ]);
};

module.exports = {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask
}