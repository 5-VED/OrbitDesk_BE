const OrganizationRepository = require('../Repository/Organization.repository');
const { UserModel, TicketModel } = require('../Models');
const messages = require('../Constants/messages');
const { HTTP_CODES } = require('../Constants/enums');

const create = async (payload) => {
    const result = await OrganizationRepository.create(payload);
    return {
        message: messages.ORG_CREATED_SUCCESS,
        data: result,
    };
};

const list = async (query = {}) => {
    const filter = {};
    if (query.search) {
        filter.name = { $regex: query.search, $options: 'i' };
    }

    const organizations = await OrganizationRepository.findAll(filter);
    const orgsWithStats = await Promise.all(
        organizations.map(async (org) => {
            const [userCount, ticketCount] = await Promise.all([
                UserModel.countDocuments({ organization_id: org._id }),
                TicketModel.countDocuments({ organization_id: org._id }),
            ]);
            return { ...org.toObject(), userCount, ticketCount };
        })
    );

    return {
        message: messages.ORG_LIST_RETRIEVED,
        data: orgsWithStats,
    };
};

const getById = async (id) => {
    const organization = await OrganizationRepository.findById(id);
    if (!organization) {
        throw {
            statusCode: HTTP_CODES.NOT_FOUND,
            message: messages.ORG_NOT_FOUND,
        };
    }
    return organization;
};

const update = async (id, payload) => {
    const existing = await OrganizationRepository.findById(id);
    if (!existing) {
        throw {
            statusCode: HTTP_CODES.NOT_FOUND,
            message: messages.ORG_NOT_FOUND,
        };
    }

    const result = await OrganizationRepository.updateById(id, payload);
    return {
        message: messages.ORG_UPDATED_SUCCESS,
        data: result,
    };
};

const remove = async (id) => {
    const existing = await OrganizationRepository.findById(id);
    if (!existing) {
        throw {
            statusCode: HTTP_CODES.NOT_FOUND,
            message: messages.ORG_NOT_FOUND,
        };
    }

    await OrganizationRepository.deleteById(id);
    return {
        message: messages.ORG_DELETED_SUCCESS,
    };
};

module.exports = {
    create,
    list,
    getById,
    update,
    remove,
};
