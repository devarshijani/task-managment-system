const Company = require("./company.model");
const paginate = require("../../utils/pagination");

// Create company
const createCompany = async (data) => {
    const company = await Company.create(data);
    return company;
};

// Get all companies with pagination
const getAllCompanies = async (query) => {
    const { page, limit, skip } = paginate(query);

    const filter = {};

    // Search by name if provided
    if (query.search) {
        filter.name = { $regex: query.search, $options: "i" };
    }

    const [companies, total] = await Promise.all([
        Company.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
        Company.countDocuments(filter),
    ]);

    return {
        companies,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
};

// Get single company
const getCompanyById = async (id) => {
    const company = await Company.findById(id);
    return company;
};

// Update company
const updateCompany = async (id, data) => {
    const company = await Company.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });
    return company;
};

// Delete company
const deleteCompany = async (id) => {
    const company = await Company.findByIdAndDelete(id);
    return company;
};

module.exports = {
    createCompany,
    getAllCompanies,
    getCompanyById,
    updateCompany,
    deleteCompany,
};