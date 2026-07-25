const express = require('express');
const router = express.Router();
const ReportsController = require('../Controllers/Reports.controller');
const auth = require('../Middlewares/Auth.middleware');
const { ROLE } = require('../Constants/enums');

router.get(
  '/summary',
  auth({ isTokenRequired: true, usersAllowed: [ROLE.ADMIN, ROLE.AGENT] }),
  ReportsController.summary
);

router.get(
  '/ticket-trends',
  auth({ isTokenRequired: true, usersAllowed: [ROLE.ADMIN, ROLE.AGENT] }),
  ReportsController.ticketTrends
);

router.get(
  '/agent-performance',
  auth({ isTokenRequired: true, usersAllowed: [ROLE.ADMIN, ROLE.AGENT] }),
  ReportsController.agentPerformance
);

router.get(
  '/channel-distribution',
  auth({ isTokenRequired: true, usersAllowed: [ROLE.ADMIN, ROLE.AGENT] }),
  ReportsController.channelDistribution
);

router.get(
  '/sla-compliance',
  auth({ isTokenRequired: true, usersAllowed: [ROLE.ADMIN, ROLE.AGENT] }),
  ReportsController.slaCompliance
);

module.exports = router;
