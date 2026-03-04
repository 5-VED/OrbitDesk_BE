const { SettingsModel } = require('../Models');
const messages = require('../Constants/messages');
const { HTTP_CODES } = require('../Constants/enums');

const DEFAULT_SETTINGS = {
  general: {
    appName: 'OrbitDesk',
    supportEmail: 'support@orbitdesk.com',
    timezone: 'UTC',
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
  },
  security: {
    minPasswordLength: 8,
    requireUppercase: true,
    requireNumbers: true,
    requireSpecial: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    twoFactorRequired: false,
  },
  email: {
    smtpHost: '',
    smtpPort: 587,
    smtpUser: '',
    smtpPassword: '',
    smtpSecure: true,
    fromName: 'OrbitDesk Support',
    fromEmail: 'noreply@orbitdesk.com',
  },
  notifications: {
    ticketCreated: { email: true, inApp: true },
    ticketAssigned: { email: true, inApp: true },
    ticketResolved: { email: true, inApp: true },
    slaBreachWarning: { email: true, inApp: true },
    slaBreached: { email: true, inApp: true },
    newComment: { email: false, inApp: true },
    userSignup: { email: true, inApp: false },
    agentStatusChange: { email: false, inApp: true },
  },
};

module.exports = {
  get: async (req, res) => {
    try {
      const { category } = req.query;
      const query = category ? { category } : {};
      const settings = await SettingsModel.find(query);

      const result = {};
      for (const s of settings) {
        if (!result[s.category]) result[s.category] = {};
        result[s.category][s.key] = s.value;
      }

      const categories = category ? [category] : Object.keys(DEFAULT_SETTINGS);
      for (const cat of categories) {
        if (!result[cat]) result[cat] = {};
        result[cat] = { ...DEFAULT_SETTINGS[cat], ...result[cat] };
      }

      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: messages.SETTINGS_FETCHED_SUCCESS,
        data: category ? result[category] : result,
      });
    } catch (error) {
      return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: messages.INTERNAL_SERVER_ERROR,
        error,
      });
    }
  },

  update: async (req, res) => {
    try {
      const { category } = req.params;
      const updates = req.body;

      if (!DEFAULT_SETTINGS[category]) {
        return res.status(HTTP_CODES.BAD_REQUEST).json({
          success: false,
          message: 'Invalid settings category',
        });
      }

      const ops = Object.entries(updates).map(([key, value]) => ({
        updateOne: {
          filter: { key, category },
          update: { $set: { key, category, value } },
          upsert: true,
        },
      }));

      if (ops.length > 0) {
        await SettingsModel.bulkWrite(ops);
      }

      const saved = await SettingsModel.find({ category });
      const result = { ...DEFAULT_SETTINGS[category] };
      for (const s of saved) {
        result[s.key] = s.value;
      }

      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: messages.SETTINGS_UPDATED_SUCCESS,
        data: result,
      });
    } catch (error) {
      return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: messages.INTERNAL_SERVER_ERROR,
        error,
      });
    }
  },
};
