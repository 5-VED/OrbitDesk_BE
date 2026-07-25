const { OrganizationModel, UserModel, TicketModel } = require('../Models');
const messages = require('../Constants/messages');
const { HTTP_CODES } = require('../Constants/enums');

module.exports = {
  create: async (req, res) => {
    try {
      const organization = await OrganizationModel.create(req.body);

      return res.status(HTTP_CODES.CREATED).json({
        success: true,
        message: messages.ORG_CREATED_SUCCESS,
        data: organization,
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
      const organizations = await OrganizationModel.find().sort({ createdAt: -1 });

      const orgsWithStats = await Promise.all(
        organizations.map(async (org) => {
          const [userCount, ticketCount] = await Promise.all([
            UserModel.countDocuments({ organization_id: org._id }),
            TicketModel.countDocuments({ organization_id: org._id }),
          ]);
          return { ...org.toObject(), userCount, ticketCount };
        })
      );

      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: messages.ORG_LIST_RETRIEVED,
        data: orgsWithStats,
      });
    } catch (error) {
      return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: messages.INTERNAL_SERVER_ERROR,
        error,
      });
    }
  },

  getById: async (req, res) => {
    try {
      const organization = await OrganizationModel.findById(req.params.id);

      if (!organization) {
        return res.status(HTTP_CODES.NOT_FOUND).json({
          success: false,
          message: messages.ORG_NOT_FOUND,
        });
      }

      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: messages.ORG_FETCHED_SUCCESS,
        data: organization,
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
      const organization = await OrganizationModel.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });

      if (!organization) {
        return res.status(HTTP_CODES.NOT_FOUND).json({
          success: false,
          message: messages.ORG_NOT_FOUND,
        });
      }

      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: messages.ORG_UPDATED_SUCCESS,
        data: organization,
      });
    } catch (error) {
      return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: messages.INTERNAL_SERVER_ERROR,
        error,
      });
    }
  },

  delete: async (req, res) => {
    try {
      const organization = await OrganizationModel.findByIdAndDelete(req.params.id);

      if (!organization) {
        return res.status(HTTP_CODES.NOT_FOUND).json({
          success: false,
          message: messages.ORG_NOT_FOUND,
        });
      }

      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: messages.ORG_DELETED_SUCCESS,
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
