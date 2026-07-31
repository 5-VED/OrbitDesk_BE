const { ConversationModel } = require('../Models');
const { HTTP_CODES } = require('../Constants/enums');

module.exports = {
  addConversation: async (req, res) => {
    try {
      const conversation = await ConversationModel.create({
        ...req.body,
        created_by: req.user?._id
      });

      return res.status(HTTP_CODES.CREATED).json({
        success: true,
        message: 'Conversation created successfully',
        data: conversation
      });
    } catch (error) {
      return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  },

  getConversations: async (req, res) => {
    try {
      const conversations = await ConversationModel.find({ is_active: true }).populate('participants', 'name email');
      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: 'Conversations fetched successfully',
        data: conversations
      });
    } catch (error) {
      return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  },

  editConversation: async (req, res) => {
    try {
      const conversation = await ConversationModel.findByIdAndUpdate(
        req.body.id || req.params.id,
        { name: req.body.name },
        { new: true }
      );
      if (!conversation) {
        return res.status(HTTP_CODES.NOT_FOUND).json({
          success: false,
          message: 'Conversation not found'
        });
      }
      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: 'Conversation updated successfully',
        data: conversation
      });
    } catch (error) {
      return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  },

  deleteConversation: async (req, res) => {
    try {
      const conversation = await ConversationModel.findByIdAndUpdate(
        req.body.id || req.params.id,
        { is_active: false },
        { new: true }
      );
      if (!conversation) {
        return res.status(HTTP_CODES.NOT_FOUND).json({
          success: false,
          message: 'Conversation not found'
        });
      }
      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: 'Conversation deleted successfully',
        data: conversation
      });
    } catch (error) {
      return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
};
