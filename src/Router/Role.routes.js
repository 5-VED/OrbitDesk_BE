const { RoleController } = require('../Controllers');
const auth = require('../Middlewares/Auth.middleware');
const { ROLE } = require('../Constants/enums');

const router = require('express').Router();

router.get(
  '/',
  auth({ isTokenRequired: true, usersAllowed: ['*'] }),
  RoleController.listRoles
);

router.post(
  '/',
  auth({ isTokenRequired: true, usersAllowed: [ROLE.ADMIN] }),
  RoleController.addRole
);

router.patch(
  '/:id',
  auth({ isTokenRequired: true, usersAllowed: [ROLE.ADMIN] }),
  RoleController.updateRole
);

router.delete(
  '/:id',
  auth({ isTokenRequired: true, usersAllowed: [ROLE.ADMIN] }),
  RoleController.removeRole
);

module.exports = router;
