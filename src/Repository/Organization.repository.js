const { OrganizationModel } = require('../Models');

module.exports = {
    create: async (data) => {
        return await OrganizationModel.create(data);
    },

    findAll: async (filter = {}, sort = { createdAt: -1 }) => {
        return await OrganizationModel.find(filter).sort(sort);
    },

    findById: async (id) => {
        return await OrganizationModel.findById(id);
    },

    updateById: async (id, data) => {
        return await OrganizationModel.findByIdAndUpdate(id, data, { new: true });
    },

    deleteById: async (id) => {
        return await OrganizationModel.findByIdAndDelete(id);
    },

    count: async (filter = {}) => {
        return await OrganizationModel.countDocuments(filter);
    },
};
