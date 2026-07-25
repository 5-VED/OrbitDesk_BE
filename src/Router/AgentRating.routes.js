const router = require('express').Router();
const AgentRatingController = require('../Controllers/AgentRating.controller');
const auth = require('../Middlewares/Auth.middleware');

router.post(
    '/ticket/:ticketId',
    auth({ isTokenRequired: true, usersAllowed: ['*'] }),
    AgentRatingController.submitRating
);

router.get(
    '/ticket/:ticketId',
    auth({ isTokenRequired: true, usersAllowed: ['*'] }),
    AgentRatingController.getRatingByTicket
);

router.get(
    '/agent/:agentId',
    auth({ isTokenRequired: true, usersAllowed: ['*'] }),
    AgentRatingController.getAgentRating
);

module.exports = router;
