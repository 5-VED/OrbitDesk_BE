const { TicketModel, TicketCommentModel } = require('../Models');

module.exports = {
    createTicket: async (payload) => {
        return await TicketModel.create(payload);
    },

    findAllTickets: async (filter, skip, limit, sort) => {
        return await TicketModel.find(filter)
            .populate('requester_id', 'first_name last_name email')
            .populate('assignee_id', 'first_name last_name email')
            .populate('group_id', 'name')
            .populate('organization_id', 'name')
            .skip(skip)
            .limit(limit)
            .sort(sort);
    },

    countTickets: async (filter) => {
        return await TicketModel.countDocuments(filter);
    },

    findTicket: async (filter) => {
        return await TicketModel.findOne(filter)
            .populate('requester_id', 'first_name last_name email')
            .populate('assignee_id', 'first_name last_name email')
            .populate('group_id', 'name')
            .populate('organization_id', 'name')
            .populate('sla_policy_id', 'title');
    },

    updateTicket: async (filter, updateData) => {
        return await TicketModel.findOneAndUpdate(filter, updateData, { new: true })
            .populate('requester_id', 'first_name last_name email')
            .populate('assignee_id', 'first_name last_name email')
            .populate('group_id', 'name');
    },

    deleteTicket: async (filter) => {
        return await TicketModel.findOneAndUpdate(filter, { is_deleted: true }, { new: true });
    },

    createComment: async (payload) => {
        return await TicketCommentModel.create(payload);
    },

    findTicketComments: async (filter) => {
        return await TicketCommentModel.find(filter)
            .populate('author_id', 'first_name last_name email')
            .sort({ createdAt: 1 });
    },

    findComment: async (filter) => {
        return await TicketCommentModel.findOne(filter)
            .populate('author_id', 'first_name last_name email');
    },

    updateComment: async (filter, updateData) => {
        return await TicketCommentModel.findOneAndUpdate(filter, updateData, { new: true })
            .populate('author_id', 'first_name last_name email');
    },

    deleteComment: async (filter) => {
        return await TicketCommentModel.findOneAndDelete(filter);
    },

    bulkUpdateTickets: async (filter, updateData) => {
        return await TicketModel.updateMany(filter, updateData);
    },

    bulkDeleteTickets: async (filter) => {
        return await TicketModel.updateMany(filter, { is_deleted: true });
    },

    getTicketStatsForOrg: async (organizationId) => {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const [counts, resolvedToday, overdueCount, breachesToday] = await Promise.all([
            TicketModel.aggregate([
                { $match: { organization_id: organizationId, is_deleted: { $ne: true } } },
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        open: { $sum: { $cond: [{ $in: ['$status', ['new', 'open']] }, 1, 0] } },
                        pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
                        solved: { $sum: { $cond: [{ $in: ['$status', ['solved', 'closed']] }, 1, 0] } },
                    },
                },
            ]),
            TicketModel.countDocuments({
                organization_id: organizationId,
                is_deleted: { $ne: true },
                solved_at: { $gte: todayStart },
            }),
            TicketModel.countDocuments({
                organization_id: organizationId,
                is_deleted: { $ne: true },
                status: { $nin: ['solved', 'closed'] },
                $or: [
                    { response_due_at: { $lt: now, $ne: null }, first_response_at: null },
                    { resolve_due_at: { $lt: now, $ne: null }, solved_at: null },
                ],
            }),
            TicketModel.countDocuments({
                organization_id: organizationId,
                is_deleted: { $ne: true },
                sla_breach_at: { $gte: todayStart },
            }),
        ]);

        const c = counts[0] || { total: 0, open: 0, pending: 0, solved: 0 };
        return { ...c, resolvedToday, overdue: overdueCount, breachesToday };
    },

    getSlaComplianceStats: async (organizationId) => {
        const result = await TicketModel.aggregate([
            {
                $match: {
                    organization_id: organizationId,
                    is_deleted: { $ne: true },
                    sla_policy_id: { $ne: null },
                },
            },
            {
                $group: {
                    _id: null,
                    totalWithSla: { $sum: 1 },
                    responseOnTime: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $ne: ['$first_response_at', null] },
                                        { $ne: ['$response_due_at', null] },
                                        { $lte: ['$first_response_at', '$response_due_at'] },
                                    ],
                                },
                                1,
                                0,
                            ],
                        },
                    },
                    responseMeasured: {
                        $sum: {
                            $cond: [
                                { $and: [{ $ne: ['$first_response_at', null] }, { $ne: ['$response_due_at', null] }] },
                                1,
                                0,
                            ],
                        },
                    },
                    resolveOnTime: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $ne: ['$solved_at', null] },
                                        { $ne: ['$resolve_due_at', null] },
                                        { $lte: ['$solved_at', '$resolve_due_at'] },
                                    ],
                                },
                                1,
                                0,
                            ],
                        },
                    },
                    resolveMeasured: {
                        $sum: {
                            $cond: [
                                { $and: [{ $ne: ['$solved_at', null] }, { $ne: ['$resolve_due_at', null] }] },
                                1,
                                0,
                            ],
                        },
                    },
                    avgResponseMs: {
                        $avg: {
                            $cond: [
                                { $and: [{ $ne: ['$first_response_at', null] }, { $ne: ['$createdAt', null] }] },
                                { $subtract: ['$first_response_at', '$createdAt'] },
                                null,
                            ],
                        },
                    },
                },
            },
        ]);

        if (!result.length) {
            return {
                firstResponseCompliance: 0,
                resolutionCompliance: 0,
                avgResponseMinutes: 0,
                totalWithSla: 0,
            };
        }

        const r = result[0];
        return {
            firstResponseCompliance: r.responseMeasured > 0
                ? Math.round((r.responseOnTime / r.responseMeasured) * 100)
                : 0,
            resolutionCompliance: r.resolveMeasured > 0
                ? Math.round((r.resolveOnTime / r.resolveMeasured) * 100)
                : 0,
            avgResponseMinutes: r.avgResponseMs
                ? Math.round(r.avgResponseMs / 60000)
                : 0,
            totalWithSla: r.totalWithSla,
        };
    },

    getTicketCountsByPolicy: async (organizationId) => {
        return await TicketModel.aggregate([
            {
                $match: {
                    organization_id: organizationId,
                    is_deleted: { $ne: true },
                    sla_policy_id: { $ne: null },
                },
            },
            {
                $group: {
                    _id: '$sla_policy_id',
                    total: { $sum: 1 },
                    breached: {
                        $sum: { $cond: [{ $ne: ['$sla_breach_at', null] }, 1, 0] },
                    },
                    resolvedOnTime: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $ne: ['$solved_at', null] },
                                        { $ne: ['$resolve_due_at', null] },
                                        { $lte: ['$solved_at', '$resolve_due_at'] },
                                    ],
                                },
                                1,
                                0,
                            ],
                        },
                    },
                    resolved: {
                        $sum: {
                            $cond: [{ $ne: ['$solved_at', null] }, 1, 0],
                        },
                    },
                },
            },
        ]);
    },

    getAgentTicketStats: async (agentIds) => {
        return await TicketModel.aggregate([
            {
                $match: {
                    assignee_id: { $in: agentIds },
                    is_deleted: { $ne: true },
                },
            },
            {
                $group: {
                    _id: '$assignee_id',
                    total: { $sum: 1 },
                    open: {
                        $sum: {
                            $cond: [
                                { $in: ['$status', ['new', 'open', 'pending', 'hold']] },
                                1,
                                0,
                            ],
                        },
                    },
                    resolved: {
                        $sum: {
                            $cond: [
                                { $in: ['$status', ['solved', 'closed']] },
                                1,
                                0,
                            ],
                        },
                    },
                },
            },
        ]);
    },
};

