const GroupService = require('../Services/Group.service');
const AuditLogService = require('../Services/AuditLog.service');
const { HTTP_CODES } = require('../Constants/enums');

const getIp = (req) => req.ip || req.headers['x-forwarded-for'] || '—';

module.exports = {
  create: async (req, res, next) => {
    try {
      const payload = { ...req.body, user: req.user };
      const result = await GroupService.create(payload);

      AuditLogService.log({
        user: req.user, action: 'Created', resource: 'Group',
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
      const result = await GroupService.list(req.query, req.user);

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
      const group = await GroupService.getById(req.params.id);

      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: 'Group fetched successfully',
        data: group,
      });
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const result = await GroupService.update(req.params.id, req.body);

      AuditLogService.log({
        user: req.user, action: 'Updated', resource: 'Group',
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
      const result = await GroupService.remove(req.params.id);

      AuditLogService.log({
        user: req.user, action: 'Deleted', resource: 'Group',
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
