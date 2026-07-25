const { RoleService } = require('../Services');
const AuditLogService = require('../Services/AuditLog.service');
const messages = require('../Constants/messages');
const { HTTP_CODES } = require('../Constants/enums');

const getIp = (req) => req.ip || req.headers['x-forwarded-for'] || '—';

module.exports = {
  addRole: async (req, res) => {
    try {
      const result = await RoleService.addRole(req.body);

      AuditLogService.log({
        user: req.user, action: 'Created', resource: 'Role',
        target: req.body.role || '', category: 'security',
        ip: getIp(req), organizationId: req.user?.organization_id,
      });

      return res.status(HTTP_CODES.CREATED).json({
        success: true,
        message: result.message,
        data: result.data,
      });
    } catch (error) {
      return res.status(error.statusCode || HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || messages.INTERNAL_SERVER_ERROR,
      });
    }
  },

  updateRole: async (req, res) => {
    try {
      const result = await RoleService.updateRole(req.params.id, req.body);

      AuditLogService.log({
        user: req.user, action: 'Modified', resource: 'Role',
        target: result.data?.role || req.params.id, category: 'security',
        ip: getIp(req), organizationId: req.user?.organization_id,
        metadata: { fields: Object.keys(req.body).join(', ') },
      });

      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: result.message,
        data: result.data,
      });
    } catch (error) {
      return res.status(error.statusCode || HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || messages.INTERNAL_SERVER_ERROR,
      });
    }
  },

  removeRole: async (req, res) => {
    try {
      const result = await RoleService.removeRole(req.params.id);

      AuditLogService.log({
        user: req.user, action: 'Deleted', resource: 'Role',
        target: result.data?.role || req.params.id, category: 'security',
        ip: getIp(req), organizationId: req.user?.organization_id,
      });

      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: result.message,
        data: result.data,
      });
    } catch (error) {
      return res.status(error.statusCode || HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || messages.INTERNAL_SERVER_ERROR,
      });
    }
  },

  listRoles: async (req, res) => {
    try {
      const result = await RoleService.getAllRoles();
      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: 'Roles fetched successfully',
        data: result,
      });
    } catch (error) {
      return res.status(error.statusCode || HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || messages.INTERNAL_SERVER_ERROR,
      });
    }
  },
};
