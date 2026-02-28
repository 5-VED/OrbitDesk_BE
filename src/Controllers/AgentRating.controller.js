const AgentRatingService = require('../Services/AgentRating.service');
const { HTTP_CODES } = require('../Constants/enums');

module.exports = {
    submitRating: async (req, res) => {
        try {
            const { rating, feedback } = req.body;
            const ticketId = req.params.ticketId;

            const result = await AgentRatingService.submitRating({
                ticketId,
                agentId: req.body.agent_id,
                raterId: req.user._id,
                rating,
                feedback,
            });

            return res.status(HTTP_CODES.CREATED).json({
                success: true,
                message: result.message,
                data: result.data,
            });
        } catch (error) {
            return res.status(error.statusCode || HTTP_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message || 'Failed to submit rating',
            });
        }
    },

    getRatingByTicket: async (req, res) => {
        try {
            const rating = await AgentRatingService.getRatingByTicket(req.params.ticketId);
            return res.status(HTTP_CODES.OK).json({
                success: true,
                data: rating,
            });
        } catch (error) {
            return res.status(error.statusCode || HTTP_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message || 'Failed to fetch rating',
            });
        }
    },

    getAgentRating: async (req, res) => {
        try {
            const stats = await AgentRatingService.getAgentRating(req.params.agentId);
            return res.status(HTTP_CODES.OK).json({
                success: true,
                data: stats,
            });
        } catch (error) {
            return res.status(error.statusCode || HTTP_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message || 'Failed to fetch agent rating',
            });
        }
    },
};
