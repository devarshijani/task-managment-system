const History = require("./history.model");
const paginate = require("../../utils/pagination");

// Create history entry
const createHistory = async (taskId, changedBy, company, previousStatus, newStatus) => {
    return await History.create({
        task: taskId,
        changedBy,
        company,
        previousStatus,
        newStatus,
    });
};

// Get history for a task
const getHistoryByTask = async (taskId, query) => {
    const { page, limit, skip } = paginate(query);

    const [history, total] = await Promise.all([
        History.find({ task: taskId })
            .populate("changedBy", "name email")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }),
        History.countDocuments({ task: taskId }),
    ]);

    return {
        history,
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
};

module.exports = { createHistory, getHistoryByTask };