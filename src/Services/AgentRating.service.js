const { AgentRatingRepository } = require('../Repository');
const { TicketRepository } = require('../Repository');
const { HTTP_CODES } = require('../Constants/enums');

const submitRating = async ({ ticketId, agentId, raterId, rating, feedback }) => {
    const ticket = await TicketRepository.findTicket({ _id: ticketId });
    if (!ticket) {
        throw { statusCode: HTTP_CODES.NOT_FOUND, message: 'Ticket not found' };
    }

    if (!ticket.assignee_id) {
        throw { statusCode: HTTP_CODES.BAD_REQUEST, message: 'Ticket has no assigned agent to rate' };
    }

    const resolvedAgent = agentId || ticket.assignee_id._id || ticket.assignee_id;

    const existing = await AgentRatingRepository.findByTicketAndRater(ticketId, raterId);
    if (existing) {
        const updated = await AgentRatingRepository.updateById(existing._id, { rating, feedback });
        return { message: 'Rating updated successfully', data: updated };
    }

    const result = await AgentRatingRepository.create({
        ticket_id: ticketId,
        agent_id: resolvedAgent,
        rated_by: raterId,
        rating,
        feedback: feedback || '',
    });

    return { message: 'Rating submitted successfully', data: result };
};

const getRatingByTicket = async (ticketId) => {
    const rating = await AgentRatingRepository.findByTicket(ticketId);
    return rating;
};

const getAgentRating = async (agentId) => {
    return await AgentRatingRepository.getAverageByAgent(agentId);
};

module.exports = {
    submitRating,
    getRatingByTicket,
    getAgentRating,
};
