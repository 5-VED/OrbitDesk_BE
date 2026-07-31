const { CustomerModel } = require('../Models');
const { HTTP_CODES } = require('../Constants/enums');
const messages = require('../Constants/messages');

module.exports = {
  create: async (req, res) => {
    try {
      const { name, email, phone, organization_id, custom_fields } = req.body;
      const customer = await CustomerModel.create({
        name,
        email,
        phone,
        organization_id,
        custom_fields
      });

      return res.status(HTTP_CODES.CREATED).json({
        success: true,
        message: 'Customer created successfully',
        data: customer
      });
    } catch (error) {
      return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  },

  getAll: async (req, res) => {
    try {
      const customers = await CustomerModel.find().populate('organization_id', 'name');
      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: 'Customers fetched successfully',
        data: customers
      });
    } catch (error) {
      return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  },

  getById: async (req, res) => {
    try {
      const customer = await CustomerModel.findById(req.params.id).populate('organization_id', 'name');
      if (!customer) {
        return res.status(HTTP_CODES.NOT_FOUND).json({
          success: false,
          message: 'Customer not found'
        });
      }
      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: 'Customer fetched successfully',
        data: customer
      });
    } catch (error) {
      return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  },

  update: async (req, res) => {
    try {
      const updates = req.body;
      const customer = await CustomerModel.findByIdAndUpdate(
        req.params.id,
        updates,
        { new: true }
      );
      if (!customer) {
        return res.status(HTTP_CODES.NOT_FOUND).json({
          success: false,
          message: 'Customer not found'
        });
      }
      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: 'Customer updated successfully',
        data: customer
      });
    } catch (error) {
      return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  },

  delete: async (req, res) => {
    try {
      const customer = await CustomerModel.findByIdAndDelete(req.params.id);
      if (!customer) {
        return res.status(HTTP_CODES.NOT_FOUND).json({
          success: false,
          message: 'Customer not found'
        });
      }
      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: 'Customer deleted successfully',
        data: customer
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
