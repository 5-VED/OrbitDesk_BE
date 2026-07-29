const OrganizationService = require('../Services/Organization.service');
const AuditLogService = require('../Services/AuditLog.service');
const { HTTP_CODES } = require('../Constants/enums');

const getIp = (req) => req.ip || req.headers['x-forwarded-for'] || '—';

module.exports = {
  create: async (req, res, next) => {
    try {
      const result = await OrganizationService.create(req.body);

      AuditLogService.log({
        user: req.user, action: 'Created', resource: 'Organization',
        target: req.body.name || '', category: 'general',
        ip: getIp(req), organizationId: req.user?.organization_id,
      });

      return res.status(HTTP_CODES.CREATED).json({
        success: true,
        message: result.message,
        data: result.data,
      });
    } catch (error) {
      next(error);
    }
  },

  list: async (req, res, next) => {
    try {
      const result = await OrganizationService.list(req.query);

      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: result.message,
        data: result.data,
      });
    } catch (error) {
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      const organization = await OrganizationService.getById(req.params.id);

      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: 'Organization fetched successfully',
        data: organization,
      });
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const result = await OrganizationService.update(req.params.id, req.body);

      AuditLogService.log({
        user: req.user, action: 'Updated', resource: 'Organization',
        target: req.params.id, category: 'general',
        ip: getIp(req), organizationId: req.user?.organization_id,
      });

      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: result.message,
        data: result.data,
      });
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      const result = await OrganizationService.remove(req.params.id);

      AuditLogService.log({
        user: req.user, action: 'Deleted', resource: 'Organization',
        target: req.params.id, category: 'general',
        ip: getIp(req), organizationId: req.user?.organization_id,
      });

      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  },
};
