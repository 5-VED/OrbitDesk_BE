const { AuditLogModel } = require('../Models');

module.exports = {
    create: async (data) => {
        return await AuditLogModel.create(data);
    },

    findAll: async (filter, { skip = 0, limit = 50, sort = { createdAt: -1 } } = {}) => {
        return await AuditLogModel.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit);
    },

    count: async (filter) => {
        return await AuditLogModel.countDocuments(filter);
    },
};
