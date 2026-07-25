const { RoleModel, UserModel } = require('../Models');

module.exports = {
    create: async (roleData) => {
        return await RoleModel.create(roleData);
    },

    findById: async (id) => {
        return await RoleModel.findById(id);
    },

    findByName: async (roleName) => {
        return await RoleModel.findOne({ role: roleName });
    },

    update: async (id, updateData) => {
        return await RoleModel.findByIdAndUpdate(id, updateData, { new: true });
    },

    deleteById: async (id) => {
        return await RoleModel.findByIdAndDelete(id);
    },

    deleteByRoleName: async (roleName) => {
        return await RoleModel.findOneAndDelete({ role: roleName }, { new: true });
    },

    getAllRoles: async () => {
        return await RoleModel.find({ is_deleted: { $ne: true } });
    },

    getUserCountsByRole: async () => {
        return await UserModel.aggregate([
            { $match: { is_deleted: { $ne: true } } },
            { $group: { _id: '$role', count: { $sum: 1 } } },
        ]);
    },
};
