const { RoleRepository } = require('../Repository');
const messages = require('../Constants/messages');
const { HTTP_CODES } = require('../Constants/enums');

const addRole = async (data) => {
    const existing = await RoleRepository.findByName(data.role);
    if (existing) {
        throw {
            statusCode: HTTP_CODES.CONFLICT,
            message: 'A role with this name already exists',
        };
    }

    const result = await RoleRepository.create(data);
    return {
        message: messages.ROLE_CREATED_SUCCESS,
        data: result,
    };
};

const updateRole = async (id, updateData) => {
    const role = await RoleRepository.findById(id);
    if (!role) {
        throw {
            statusCode: HTTP_CODES.NOT_FOUND,
            message: 'Role not found',
        };
    }

    if (updateData.role && updateData.role !== role.role) {
        const existing = await RoleRepository.findByName(updateData.role);
        if (existing) {
            throw {
                statusCode: HTTP_CODES.CONFLICT,
                message: 'A role with this name already exists',
            };
        }
    }

    const result = await RoleRepository.update(id, updateData);
    return {
        message: 'Role updated successfully',
        data: result,
    };
};

const removeRole = async (id) => {
    const role = await RoleRepository.findById(id);
    if (!role) {
        throw {
            statusCode: HTTP_CODES.NOT_FOUND,
            message: 'Role not found',
        };
    }

    if (role.isSystem) {
        throw {
            statusCode: HTTP_CODES.BAD_REQUEST,
            message: 'System roles cannot be deleted',
        };
    }

    const result = await RoleRepository.deleteById(id);
    return {
        message: messages.ROLE_DELETED_SUCCESS,
        data: result,
    };
};

const getAllRoles = async () => {
    const roles = await RoleRepository.getAllRoles();
    const userCounts = await RoleRepository.getUserCountsByRole();

    const countMap = {};
    userCounts.forEach(item => {
        countMap[item._id?.toString()] = item.count;
    });

    return roles.map(role => ({
        ...role.toObject(),
        userCount: countMap[role._id.toString()] || 0,
    }));
};

module.exports = {
    addRole,
    updateRole,
    removeRole,
    getAllRoles,
};
