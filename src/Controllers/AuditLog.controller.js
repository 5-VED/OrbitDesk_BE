const AuditLogService = require('../Services/AuditLog.service');
const { HTTP_CODES } = require('../Constants/enums');

module.exports = {
    list: async (req, res, next) => {
        try {
            const result = await AuditLogService.list({
                organizationId: req.user.organization_id,
                search: req.query.search,
                category: req.query.category,
                page: req.query.page,
                limit: req.query.limit,
            });
            res.status(HTTP_CODES.OK).json({ success: true, ...result });
        } catch (error) {
            next(error);
        }
    },

    exportCsv: async (req, res, next) => {
        try {
            const csv = await AuditLogService.exportLogs({
                organizationId: req.user.organization_id,
                search: req.query.search,
                category: req.query.category,
            });
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=audit-log.csv');
            res.send(csv);
        } catch (error) {
            next(error);
        }
    },
};
