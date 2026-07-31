const router = require('express').Router();
const HealthController = require('../Controllers/Health.controller');

router.get('/', HealthController.getHealth);

module.exports = router;
