const router = require('express').Router();
const NotificationController = require('../Controllers/Notification.controller');
const auth = require('../Middlewares/Auth.middleware');
const { ROLE } = require('../Constants/enums');

router.get(
    '/',
    auth({ isTokenRequired: true, usersAllowed: [ROLE.ADMIN, ROLE.AGENT, ROLE.USER] }),
    NotificationController.list
);

router.patch(
    '/:id/read',
    auth({ isTokenRequired: true, usersAllowed: [ROLE.ADMIN, ROLE.AGENT, ROLE.USER] }),
    NotificationController.markRead
);

router.patch(
    '/mark-all-read',
    auth({ isTokenRequired: true, usersAllowed: [ROLE.ADMIN, ROLE.AGENT, ROLE.USER] }),
    NotificationController.markAllRead
);

module.exports = router;
