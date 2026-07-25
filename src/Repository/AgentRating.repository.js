const { AgentRatingModel } = require('../Models');

module.exports = {
    create: async (data) => {
        return await AgentRatingModel.create(data);
    },

    findByTicketAndRater: async (ticketId, raterId) => {
        return await AgentRatingModel.findOne({ ticket_id: ticketId, rated_by: raterId });
    },

    updateById: async (id, data) => {
        return await AgentRatingModel.findByIdAndUpdate(id, data, { new: true });
    },

    findByTicket: async (ticketId) => {
        return await AgentRatingModel.findOne({ ticket_id: ticketId })
            .populate('rated_by', 'first_name last_name')
            .populate('agent_id', 'first_name last_name');
    },

    getAverageByAgent: async (agentId) => {
        const result = await AgentRatingModel.aggregate([
            { $match: { agent_id: agentId } },
            {
                $group: {
                    _id: '$agent_id',
                    avgRating: { $avg: '$rating' },
                    totalRatings: { $sum: 1 },
                },
            },
        ]);
        return result[0] || { avgRating: 0, totalRatings: 0 };
    },

    getAverageForAllAgents: async (agentIds) => {
        return await AgentRatingModel.aggregate([
            { $match: { agent_id: { $in: agentIds } } },
            {
                $group: {
                    _id: '$agent_id',
                    avgRating: { $avg: '$rating' },
                    totalRatings: { $sum: 1 },
                },
            },
        ]);
    },
};
