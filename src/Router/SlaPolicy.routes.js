const express = require('express');
const router = express.Router();
const SlaPolicyController = require('../Controllers/SlaPolicy.controller');
const auth = require('../Middlewares/Auth.middleware');
const { ROLE } = require('../Constants/enums');

router.get('/metrics', auth({ isTokenRequired: true, usersAllowed: ['*'] }), SlaPolicyController.metrics);
router.get('/dashboard-stats', auth({ isTokenRequired: true, usersAllowed: ['*'] }), SlaPolicyController.dashboardStats);

router.get('/', auth({ isTokenRequired: true, usersAllowed: ['*'] }), SlaPolicyController.list);
router.post('/', auth({ isTokenRequired: true, usersAllowed: [ROLE.ADMIN] }), SlaPolicyController.create);
router.post('/reorder', auth({ isTokenRequired: true, usersAllowed: [ROLE.ADMIN] }), SlaPolicyController.reorder);
router.get('/:id', auth({ isTokenRequired: true, usersAllowed: ['*'] }), SlaPolicyController.get);
router.patch('/:id', auth({ isTokenRequired: true, usersAllowed: [ROLE.ADMIN] }), SlaPolicyController.update);
router.delete('/:id', auth({ isTokenRequired: true, usersAllowed: [ROLE.ADMIN] }), SlaPolicyController.delete);

module.exports = router;
