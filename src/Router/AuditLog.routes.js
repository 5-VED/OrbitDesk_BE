const express = require('express');
const router = express.Router();
const AuditLogController = require('../Controllers/AuditLog.controller');
const auth = require('../Middlewares/Auth.middleware');
const { ROLE } = require('../Constants/enums');

router.get('/', auth({ isTokenRequired: true, usersAllowed: [ROLE.ADMIN] }), AuditLogController.list);
router.get('/export', auth({ isTokenRequired: true, usersAllowed: [ROLE.ADMIN] }), AuditLogController.exportCsv);

module.exports = router;
