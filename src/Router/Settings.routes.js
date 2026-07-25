const express = require('express');
const router = express.Router();
const SettingsController = require('../Controllers/Settings.controller');
const auth = require('../Middlewares/Auth.middleware');
const { ROLE } = require('../Constants/enums');

router.get(
  '/',
  auth({ isTokenRequired: true, usersAllowed: [ROLE.ADMIN] }),
  SettingsController.get
);

router.patch(
  '/:category',
  auth({ isTokenRequired: true, usersAllowed: [ROLE.ADMIN] }),
  SettingsController.update
);

module.exports = router;
