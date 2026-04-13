const Task = require("../modules/task/task.model");

const generateTaskId = async (shortCode) => {
    // Count existing tasks for this project short code
    const count = await Task.countDocuments({
        taskId: new RegExp(`^${shortCode}-`),
    });

    const nextNumber = String(count + 1).padStart(2, "0");
    return `${shortCode}-${nextNumber}`;
};

module.exports = generateTaskId;