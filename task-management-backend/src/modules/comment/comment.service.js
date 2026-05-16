const Comment = require("./comment.model");
const Task = require("../task/task.model");
const paginate = require("../../utils/pagination");
const { sendNotification } = require("../notification/notification.service");


// Create comment
const createComment = async (data, user) => {
    // Check task exists and belongs to company
    const task = await Task.findById(data.task);
    if (!task) throw new Error("Task not found");

    if (task.company.toString() !== user.company.toString()) {
        throw new Error("Not authorized to comment on this task");
    }

    const comment = await Comment.create({
        content: data.content,
        task: data.task,
        author: user._id,
        company: user.company,
    });

    const fullTask = await Task.findById(data.task)
        .populate("assignedTo", "name email fcmToken")
        .populate("project", "name");

    if (fullTask?.assignedTo) {
        await sendNotification({
            recipient: fullTask.assignedTo._id,
            company: user.company,
            type: "comment_added",
            title: `New Comment on ${fullTask.taskId}`,
            body: `${user.name} commented: "${data.content.substring(0, 100)}"`,
            data: {
                taskId: fullTask.taskId,
                taskTitle: fullTask.title,
                projectName: fullTask.project?.name,
                commenterName: user.name,
            },
            fcmToken: fullTask.assignedTo.fcmToken,
        });
    }

    return comment.populate("author", "name email");
};

// Get all comments for a task
const getCommentsByTask = async (taskId, query, user) => {
    const { page, limit, skip } = paginate(query);

    // Check task exists and belongs to company
    const task = await Task.findById(taskId);
    if (!task) throw new Error("Task not found");

    if (task.company.toString() !== user.company.toString()) {
        throw new Error("Not authorized to view comments on this task");
    }

    const filter = { task: taskId };

    const [comments, total] = await Promise.all([
        Comment.find(filter)
            .populate("author", "name email")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }),
        Comment.countDocuments(filter),
    ]);

    return {
        comments,
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
};

// Update comment
const updateComment = async (id, content, userId) => {
    const comment = await Comment.findById(id);
    if (!comment) return null;

    // Only author can update their comment
    if (comment.author.toString() !== userId.toString()) {
        throw new Error("Not authorized to update this comment");
    }

    comment.content = content;
    await comment.save();

    return comment.populate("author", "name email");
};

// Delete comment
const deleteComment = async (id, userId, role) => {
    const comment = await Comment.findById(id);
    if (!comment) return null;

    // Author or admin can delete
    if (
        comment.author.toString() !== userId.toString() &&
        role !== "admin"
    ) {
        throw new Error("Not authorized to delete this comment");
    }

    await Comment.findByIdAndDelete(id);
    return comment;
};

module.exports = {
    createComment,
    getCommentsByTask,
    updateComment,
    deleteComment,
};