const { UserModel, RoleModel, OrganizationModel } = require('../Models');
const bcrypt = require('bcrypt');
const logger = require('../Utils/logger.utils');

const DEFAULT_USERS = [
    {
        first_name: 'System',
        last_name: 'Admin',
        email: 'admin@yopmail.com',
        password: 'Admin@123',
        phone: '8238316560',
        role_type: 'admin',
        gender: 'male',
        country_code: '+91',
        status: 'offline',
        is_active: true,
    },
    {
        first_name: 'Vishaw',
        last_name: 'Desai',
        email: 'agent@yopmail.com',
        password: 'Hello@123',
        phone: '9999999998',
        role_type: 'agent',
        gender: 'male',
        country_code: '+91',
        status: 'offline',
        is_active: true,
    },
    {
        first_name: 'Vivek',
        last_name: 'Suthar',
        email: 'vivek@yopmail.com',
        password: 'Hello@123',
        phone: '9999999997',
        role_type: 'customer',
        gender: 'male',
        country_code: '+1',
        status: 'offline',
        is_active: true,
    },
];

const seedUsers = async () => {
    logger.info('Seeding users...');

    const roles = await RoleModel.find({ role: { $in: ['Admin', 'Agent', 'Customer'] } });
    const roleMap = {};
    for (const r of roles) {
        roleMap[r.role.toLowerCase()] = r._id;
    }

    if (Object.keys(roleMap).length < 3) {
        logger.warn('  Not all roles found — run role seeder first');
    }

    let orgId = null;
    const org = await OrganizationModel.findOne({});
    if (org) {
        orgId = org._id;
    }

    const results = [];
    for (const userData of DEFAULT_USERS) {
        const existing = await UserModel.findOne({ email: userData.email });
        if (existing) {
            logger.info(`  User "${userData.email}" already exists — skipping`);
            results.push({ action: 'skipped', email: userData.email });
            continue;
        }

        const roleId = roleMap[userData.role_type];
        const payload = {
            ...userData,
            password: bcrypt.hashSync(userData.password, 10),
            role: roleId || null,
            organization_id: orgId,
        };

        await UserModel.create(payload);
        logger.info(`  User "${userData.email}" created (role: ${userData.role_type})`);
        results.push({ action: 'created', email: userData.email, role_type: userData.role_type });
    }

    logger.info(`Users seeding complete — ${results.filter(r => r.action === 'created').length} created, ${results.filter(r => r.action === 'skipped').length} skipped`);
    return results;
};

module.exports = { seedUsers, DEFAULT_USERS };

// if (require.main === module) {
    const connectMongoDB = require('../Database/MongoDB');
    (async () => {
        try {
            await connectMongoDB();
            await seedUsers();
            process.exit(0);
        } catch (error) {
            logger.error('User seeding failed:', error);
            process.exit(1);
        }
    })();
// }