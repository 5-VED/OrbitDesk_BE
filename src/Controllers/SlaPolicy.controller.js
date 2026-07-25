const SlaPolicyService = require('../Services/SlaPolicy.service');
const AuditLogService = require('../Services/AuditLog.service');
const { HTTP_CODES } = require('../Constants/enums');

const getIp = (req) => req.ip || req.headers['x-forwarded-for'] || '—';

module.exports = {
    create: async (req, res, next) => {
        try {
            const result = await SlaPolicyService.createPolicy(req.body);

            AuditLogService.log({
                user: req.user, action: 'Created', resource: 'SLA Policy',
                target: req.body.title || '', category: 'policy',
                ip: getIp(req), organizationId: req.user?.organization_id,
            });

            res.status(HTTP_CODES.CREATED).json(result);
        } catch (error) {
            next(error);
        }
    },

    list: async (req, res, next) => {
        try {
            const result = await SlaPolicyService.listPolicies(req.query);
            res.status(HTTP_CODES.OK).json(result);
        } catch (error) {
            next(error);
        }
    },

    get: async (req, res, next) => {
        try {
            const result = await SlaPolicyService.getPolicy(req.params.id);
            res.status(HTTP_CODES.OK).json({ data: result });
        } catch (error) {
            next(error);
        }
    },

    update: async (req, res, next) => {
        try {
            const result = await SlaPolicyService.updatePolicy(req.params.id, req.body);

            AuditLogService.log({
                user: req.user, action: 'Updated', resource: 'SLA Policy',
                target: result.data?.title || req.params.id, category: 'policy',
                ip: getIp(req), organizationId: req.user?.organization_id,
            });

            res.status(HTTP_CODES.OK).json(result);
        } catch (error) {
            next(error);
        }
    },

    delete: async (req, res, next) => {
        try {
            const result = await SlaPolicyService.deletePolicy(req.params.id);

            AuditLogService.log({
                user: req.user, action: 'Deleted', resource: 'SLA Policy',
                target: req.params.id, category: 'policy',
                ip: getIp(req), organizationId: req.user?.organization_id,
            });

            res.status(HTTP_CODES.OK).json(result);
        } catch (error) {
            next(error);
        }
    },

    reorder: async (req, res, next) => {
        try {
            const result = await SlaPolicyService.reorderPolicies(req.body.orderedIds);
            res.status(HTTP_CODES.OK).json(result);
        } catch (error) {
            next(error);
        }
    },

    metrics: async (req, res, next) => {
        try {
            const result = await SlaPolicyService.getMetrics(req.user.organization_id);
            res.status(HTTP_CODES.OK).json(result);
        } catch (error) {
            next(error);
        }
    },

    dashboardStats: async (req, res, next) => {
        try {
            const result = await SlaPolicyService.getDashboardStats(req.user.organization_id);
            res.status(HTTP_CODES.OK).json(result);
        } catch (error) {
            next(error);
        }
    },
};
