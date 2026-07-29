const { UserNotificationModel } = require('../Models');
const { HTTP_CODES } = require('../Constants/enums');

module.exports = {
  list: async (req, res, next) => {
    try {
      const notifications = await UserNotificationModel.find({ recipient: req.user._id, isArchived: false })
        .sort({ createdAt: -1 })
        .limit(20)
        .lean();

      const unreadCount = await UserNotificationModel.countDocuments({ recipient: req.user._id, isRead: false, isArchived: false });

      return res.status(HTTP_CODES.OK).json({
        success: true,
        data: notifications,
        unreadCount,
      });
    } catch (error) {
      next(error);
    }
  },

  markRead: async (req, res, next) => {
    try {
      const { id } = req.params;
      await UserNotificationModel.findByIdAndUpdate(id, { isRead: true, readAt: new Date() });

      return res.status(HTTP_CODES.OK).json({ success: true });
    } catch (error) {
      next(error);
    }
  },

  markAllRead: async (req, res, next) => {
    try {
      await UserNotificationModel.updateMany(
        { recipient: req.user._id, isRead: false },
        { isRead: true, readAt: new Date() }
      );

      return res.status(HTTP_CODES.OK).json({ success: true });
    } catch (error) {
      next(error);
    }
  },
};
