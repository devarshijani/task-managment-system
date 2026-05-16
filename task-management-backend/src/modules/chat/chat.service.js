const Chat = require("./chat.model");
const paginate = require("../../utils/pagination");

// Save message to DB
const saveMessage = async (projectId, senderId, companyId, message) => {
    const chat = await Chat.create({
        project: projectId,
        sender: senderId,
        company: companyId,
        message,
    });

    return chat.populate("sender", "name email");
};

// Get chat history for a project
const getChatHistory = async (projectId, query) => {
    const { page, limit, skip } = paginate(query);

    const [messages, total] = await Promise.all([
        Chat.find({ project: projectId })
            .populate("sender", "name email")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }),
        Chat.countDocuments({ project: projectId }),
    ]);

    return {
        messages: messages.reverse(),
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
};

module.exports = { saveMessage, getChatHistory };