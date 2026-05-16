const Plan = require("./plan.model");
const paginate = require("../../utils/pagination");

const createPlan = async (data) => {
    return await Plan.create(data);
};

const getAllPlans = async (query) => {
    const { page, limit, skip } = paginate(query);
    const filter = { isActive: true };

    const [plans, total] = await Promise.all([
        Plan.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
        Plan.countDocuments(filter),
    ]);

    return {
        plans,
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
};

const getPlanById = async (id) => {
    return await Plan.findById(id);
};

const updatePlan = async (id, data) => {
    return await Plan.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

const deletePlan = async (id) => {
    return await Plan.findByIdAndDelete(id);
};

module.exports = { createPlan, getAllPlans, getPlanById, updatePlan, deletePlan };