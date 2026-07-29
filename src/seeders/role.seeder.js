const { RoleModel } = require('../Models');
const logger = require('../Utils/logger.utils');
const connectMongoDB = require('../Database/MongoDB');

const DEFAULT_ROLES = [
  {
    role: 'Admin',
    description:
      'Full system access. Can manage users, tickets, settings, and all administrative functions.',
    permissions: [
      'tickets:create',
      'tickets:read',
      'tickets:write',
      'tickets:delete',
      'tickets:assign',
      'tickets:merge',
      'tickets:bulk-update',
      'tickets:bulk-delete',
      'users:create',
      'users:read',
      'users:write',
      'users:delete',
      'users:bulk-import',
      'users:bulk-delete',
      'users:disable',
      'organizations:create',
      'organizations:read',
      'organizations:write',
      'organizations:delete',
      'groups:create',
      'groups:read',
      'groups:write',
      'groups:delete',
      'roles:create',
      'roles:read',
      'roles:write',
      'roles:delete',
      'sla:create',
      'sla:read',
      'sla:write',
      'sla:delete',
      'reports:read',
      'reports:export',
      'settings:read',
      'settings:write',
      'audit-logs:read',
      'audit-logs:export',
      'kb:create',
      'kb:read',
      'kb:write',
      'kb:delete',
      'notifications:read',
      'notifications:write',
      'api-keys:create',
      'api-keys:read',
      'api-keys:write',
      'api-keys:delete',
    ],
    isSystem: true,
  },
  {
    role: 'Agent',
    description:
      'Ticket management access. Can create, update, and resolve tickets assigned to them.',
    permissions: [
      'tickets:create',
      'tickets:read',
      'tickets:write',
      'tickets:assign',
      'users:read',
      'organizations:read',
      'groups:read',
      'reports:read',
      'kb:create',
      'kb:read',
      'kb:write',
      'notifications:read',
    ],
    isSystem: true,
  },
  {
    role: 'User',
    description: 'Basic access. Can submit and track their own tickets.',
    permissions: ['tickets:create', 'tickets:read', 'kb:read', 'notifications:read'],
    isSystem: true,
  },
];

const seedRoles = async () => {
  logger.info('Seeding roles...');

  const results = [];
  for (const roleData of DEFAULT_ROLES) {
    const existing = await RoleModel.findOne({ role: roleData.role });
    if (existing) {
      logger.info(`  Role "${roleData.role}" already exists — updating permissions`);
      existing.permissions = roleData.permissions;
      existing.description = roleData.description;
      await existing.save();
      results.push({ action: 'updated', role: roleData.role });
    } else {
      await RoleModel.create(roleData);
      logger.info(`  Role "${roleData.role}" created`);
      results.push({ action: 'created', role: roleData.role });
    }
  }

  logger.info(
    `Roles seeding complete — ${results.filter(r => r.action === 'created').length} created, ${results.filter(r => r.action === 'updated').length} updated`
  );
  return results;
};

module.exports = { seedRoles, DEFAULT_ROLES };

if (require.main === module) {
  (async () => {
    try {
      await connectMongoDB();
      await seedRoles();
      process.exit(0);
    } catch (error) {
      logger.error('Role seeding failed:', error);
      process.exit(1);
    }
  })();
}
