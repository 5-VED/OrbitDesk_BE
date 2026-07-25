const express = require('express');
const router = express.Router();
const DashboardController = require('../Controllers/Dashboard.controller');
const auth = require('../Middlewares/Auth.middleware');
const { ROLE } = require('../Constants/enums');

router.get(
  '/stats',
  auth({ isTokenRequired: true, usersAllowed: [ROLE.ADMIN] }),
  DashboardController.stats
);

router.get(
  '/sla-overview',
  auth({ isTokenRequired: true, usersAllowed: [ROLE.ADMIN] }),
  DashboardController.slaOverview
);

router.get(
  '/top-agents',
  auth({ isTokenRequired: true, usersAllowed: [ROLE.ADMIN] }),
  DashboardController.topAgents
);

router.get(
  '/recent-activity',
  auth({ isTokenRequired: true, usersAllowed: [ROLE.ADMIN] }),
  DashboardController.recentActivity
);

module.exports = router;
