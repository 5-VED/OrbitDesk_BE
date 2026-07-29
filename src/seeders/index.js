const connectMongoDB = require('../Database/MongoDB');
const { seedRoles } = require('./role.seeder');
const { seedUsers } = require('./user.seeder');
const logger = require('../Utils/logger.utils');

const runSeeders = async () => {
    logger.info('========================================');
    logger.info('  OrbitDesk Database Seeder');
    logger.info('========================================');

    await connectMongoDB();

    await seedRoles();
    await seedUsers();

    logger.info('========================================');
    logger.info('  All seeders completed successfully');
    logger.info('========================================');
};

runSeeders()
    .then(() => process.exit(0))
    .catch((error) => {
        logger.error('Seeder failed:', error);
        process.exit(1);
    });