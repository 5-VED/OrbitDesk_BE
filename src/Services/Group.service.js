const GroupRepository = require('../Repository/Group.repository');
const { UserModel, TicketModel } = require('../Models');
const messages = require('../Constants/messages');
const { HTTP_CODES } = require('../Constants/enums');

const create = async (payload) => {
    if (!payload.organization_id && payload.user?.organization_id) {
        payload.organization_id = payload.user.organization_id;
    }
    const result = await GroupRepository.create(payload);
    return {
        message: messages.GROUP_CREATED_SUCCESS,
        data: result,
    };
};

const list = async (query = {}, user = null) => {
    const filter = {};
    if (user?.organization_id) {
        filter.organization_id = user.organization_id;
    }
    if (query.search) {
        filter.name = { $regex: query.search, $options: 'i' };
    }

    const groups = await GroupRepository.findAll(filter);
    const groupsWithStats = await Promise.all(
        groups.map(async (group) => {
            const [memberCount, ticketCount] = await Promise.all([
                UserModel.countDocuments({ groups: group._id }),
                TicketModel.countDocuments({ group_id: group._id }),
            ]);
            return { ...group.toObject(), memberCount, ticketCount };
        })
    );

    return {
        message: messages.GROUP_LIST_RETRIEVED,
        data: groupsWithStats,
    };
};

const getById = async (id) => {
    const group = await GroupRepository.findById(id);
    if (!group) {
        throw {
            statusCode: HTTP_CODES.NOT_FOUND,
            message: messages.GROUP_NOT_FOUND,
        };
    }
    return group;
};

const update = async (id, payload) => {
    const existing = await GroupRepository.findById(id);
    if (!existing) {
        throw {
            statusCode: HTTP_CODES.NOT_FOUND,
            message: messages.GROUP_NOT_FOUND,
        };
    }

    const result = await GroupRepository.updateById(id, payload);
    return {
        message: messages.GROUP_UPDATED_SUCCESS,
        data: result,
    };
};

const remove = async (id) => {
    const existing = await GroupRepository.findById(id);
    if (!existing) {
        throw {
            statusCode: HTTP_CODES.NOT_FOUND,
            message: messages.GROUP_NOT_FOUND,
        };
    }

    await GroupRepository.deleteById(id);
    return {
        message: messages.GROUP_DELETED_SUCCESS,
    };
};

module.exports = {
    create,
    list,
    getById,
    update,
    remove,
};
