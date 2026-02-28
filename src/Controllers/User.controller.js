const UserService = require('../Services/User.service');
const AuditLogService = require('../Services/AuditLog.service');
const messages = require('../Constants/messages');
const { HTTP_CODES } = require('../Constants/enums');

const getIp = (req) => req.ip || req.headers['x-forwarded-for'] || '—';

module.exports = {
  signup: async (req, res) => {
    try {
      const payload = { ...req.body };
      if (req.file) {
        payload.profile_pic = `/uploads/${req.file.filename}`;
      }
      const result = await UserService.signup(payload);
      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: result.message,
        data: result.data,
      });
    } catch (error) {
      return res.status(error.statusCode || HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || messages.INTERNAL_SERVER_ERROR,
        error,
      });
    }
  },

  disableUser: async (req, res) => {
    try {
      const result = await UserService.disableUser(req.body._id);

      AuditLogService.log({
        user: req.user, action: 'Disabled', resource: 'User',
        target: req.body._id, category: 'security',
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
        error,
      });
    }
  },

  addAttachments: async (req, res) => {
    try {
      const result = await UserService.addAttachments(req.files);
      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: result.message,
        data: result.data,
      });
    } catch (error) {
      return res.status(error.statusCode || HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || messages.INTERNAL_SERVER_ERROR,
        error,
      });
    }
  },

  removeAttachments: async (req, res) => {
    try {
      const result = await UserService.removeAttachments(req.params.id);
      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: result.message,
        data: result.data,
      });
    } catch (error) {
      return res.status(error.statusCode || HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || messages.INTERNAL_SERVER_ERROR,
        error,
      });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const userAgentInfo = req.userAgentInfo;
      const result = await UserService.login(email, password, userAgentInfo);

      res.cookie('token', result.data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        maxAge: 2 * 24 * 60 * 60 * 1000,
        path: '/',
      });

      AuditLogService.log({
        user: { _id: result.data.user?._id, email, role: result.data.user?.role?.role, organization_id: result.data.user?.organization_id },
        action: 'Logged in', resource: 'Session',
        target: email, category: 'security',
        ip: getIp(req), organizationId: result.data.user?.organization_id,
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
        error,
      });
    }
  },

  getMe: async (req, res) => {
    try {
      const user = await UserService.getMe(req.user._id);
      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: 'User session valid',
        data: user,
      });
    } catch (error) {
      return res.status(error.statusCode || HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || messages.INTERNAL_SERVER_ERROR,
        error,
      });
    }
  },

  logoutUser: async (req, res) => {
    try {
      AuditLogService.log({
        user: req.user, action: 'Logged out', resource: 'Session',
        target: req.user?.email || '', category: 'security',
        ip: getIp(req), organizationId: req.user?.organization_id,
      });

      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        path: '/',
      });
      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: messages.INTERNAL_SERVER_ERROR,
        error,
      });
    }
  },

  list: async (req, res) => {
    try {
      const result = await UserService.list(req.query);
      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: messages.USER_LIST_RETRIEVED,
        data: result,
      });
    } catch (error) {
      return res.status(error.statusCode || HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || messages.INTERNAL_SERVER_ERROR,
        error,
      });
    }
  },

  getAgentsWithStats: async (req, res) => {
    try {
      const result = await UserService.getAgentsWithStats(req.query);
      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: 'Agents retrieved successfully',
        data: result,
      });
    } catch (error) {
      return res.status(error.statusCode || HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || messages.INTERNAL_SERVER_ERROR,
        error,
      });
    }
  },

  getById: async (req, res) => {
    try {
      const result = await UserService.getById(req.params.id);
      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: messages.USER_FETCHED_SUCCESS,
        data: result,
      });
    } catch (error) {
      return res.status(error.statusCode || HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || messages.INTERNAL_SERVER_ERROR,
        error,
      });
    }
  },

  update: async (req, res) => {
    try {
      const payload = { ...req.body };
      if (req.file) {
        payload.profile_pic = `/uploads/${req.file.filename}`;
      }

      const result = await UserService.update(req.params.id, payload);

      AuditLogService.log({
        user: req.user, action: 'Updated', resource: 'User',
        target: result?.email || req.params.id, category: 'user',
        ip: getIp(req), organizationId: req.user?.organization_id,
        metadata: { fields: Object.keys(payload).join(', ') },
      });

      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: messages.USER_UPDATED_SUCCESS,
        data: result,
      });
    } catch (error) {
      return res.status(error.statusCode || HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || messages.INTERNAL_SERVER_ERROR,
        error,
      });
    }
  },

  create: async (req, res) => {
    try {
      const payload = { ...req.body };
      if (req.file) {
        payload.profile_pic = `/uploads/${req.file.filename}`;
      }
      const result = await UserService.signup(payload);

      AuditLogService.log({
        user: req.user, action: 'Created', resource: 'User',
        target: payload.email || '', category: 'user',
        ip: getIp(req), organizationId: req.user?.organization_id,
      });

      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: messages.USER_CREATED_SUCCESS,
        data: result.data,
      });
    } catch (error) {
      return res.status(error.statusCode || HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || messages.INTERNAL_SERVER_ERROR,
        error,
      });
    }
  },

  bulkImport: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(HTTP_CODES.BAD_REQUEST).json({
          success: false,
          message: 'No file uploaded',
        });
      }

      const result = await UserService.bulkImport(req.file.buffer);

      AuditLogService.log({
        user: req.user, action: 'Bulk imported', resource: 'Users',
        target: `${result.data?.successCount || 0} users imported`, category: 'user',
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
        error,
      });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const result = await UserService.deleteUser(req.params.id);

      AuditLogService.log({
        user: req.user, action: 'Deleted', resource: 'User',
        target: req.params.id, category: 'user',
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
        error,
      });
    }
  },

  bulkDelete: async (req, res) => {
    try {
      const { ids } = req.body;
      const result = await UserService.bulkDelete(ids);

      AuditLogService.log({
        user: req.user, action: 'Bulk deleted', resource: 'Users',
        target: `${ids?.length || 0} users`, category: 'user',
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
        error,
      });
    }
  },

  forgotPassword: async (req, res) => {
    try {
      const result = await UserService.forgotPassword(req.body.email);
      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      return res.status(error.statusCode || HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || messages.INTERNAL_SERVER_ERROR,
      });
    }
  },

  verifyOtp: async (req, res) => {
    try {
      const result = await UserService.verifyOtp(req.body.email, req.body.otp);
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

  resetPassword: async (req, res) => {
    try {
      const result = await UserService.resetPassword(req.body.token, req.body.password);

      AuditLogService.log({
        user: null, action: 'Reset password', resource: 'User',
        target: '', category: 'security',
        ip: getIp(req),
      });

      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      return res.status(error.statusCode || HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || messages.INTERNAL_SERVER_ERROR,
      });
    }
  },
};
