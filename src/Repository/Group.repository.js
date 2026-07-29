const { GroupModel } = require('../Models');

module.exports = {
    create: async (data) => {
        return await GroupModel.create(data);
    },

    findAll: async (filter = {}, sort = { createdAt: -1 }) => {
        return await GroupModel.find(filter).sort(sort);
    },

    findById: async (id) => {
        return await GroupModel.findById(id);
    },

    updateById: async (id, data) => {
        return await GroupModel.findByIdAndUpdate(id, data, { new: true });
    },

    deleteById: async (id) => {
        return await GroupModel.findByIdAndDelete(id);
    },

    count: async (filter = {}) => {
        return await GroupModel.countDocuments(filter);
    },
};
