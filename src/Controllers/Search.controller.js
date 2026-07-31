const { TicketModel, CustomerModel, KnowledgeBaseModel } = require('../Models');
const { HTTP_CODES } = require('../Constants/enums');

module.exports = {
  search: async (req, res) => {
    try {
      const { q, type } = req.query;
      
      if (!q) {
        return res.status(HTTP_CODES.BAD_REQUEST).json({
          success: false,
          message: 'Query parameter "q" is required'
        });
      }

      let results = [];
      const regex = new RegExp(q, 'i');

      if (!type || type === 'tickets') {
        const tickets = await TicketModel.find({ subject: regex }).limit(10);
        results.push(...tickets.map(t => ({ type: 'ticket', id: t._id, title: t.subject })));
      }

      if (!type || type === 'user') {
        const customers = await CustomerModel.find({ name: regex }).limit(10);
        results.push(...customers.map(c => ({ type: 'customer', id: c._id, title: c.name })));
      }

      if (!type || type === 'kb') {
        const kb = await KnowledgeBaseModel.find({ title: regex }).limit(10);
        results.push(...kb.map(k => ({ type: 'kb', id: k._id, title: k.title })));
      }

      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: 'Search completed',
        data: results
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
