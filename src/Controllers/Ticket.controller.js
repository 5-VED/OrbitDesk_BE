const TicketService = require('../Services/Ticket.service');
const AuditLogService = require('../Services/AuditLog.service');
const { HTTP_CODES } = require('../Constants/enums');
const messages = require('../Constants/messages');

const getIp = (req) => req.ip || req.headers['x-forwarded-for'] || '—';

module.exports = {
  create: async (req, res) => {
    try {
      const payload = {
        ...req.body,
        submitter_id: req.user._id,
        requester_id: req.body?.requester_id || req.user._id,
        organization_id: req.user.organization_id,
      };

      const result = await TicketService.createTicket(payload);

      AuditLogService.log({
        user: req.user, action: 'Created', resource: 'Ticket',
        target: result.data?.subject || '', category: 'data',
        ip: getIp(req), organizationId: req.user.organization_id,
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

  list: async (req, res) => {
    try {
      const result = await TicketService.listTickets({
        organizationId: req.user.organization_id,
        queryParams: req.query
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

  getDetails: async (req, res) => {
    try {
      const result = await TicketService.getTicketDetails({
        ticketId: req.params.id,
        organizationId: req.user.organization_id
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

  update: async (req, res) => {
    try {
      const result = await TicketService.updateTicket({
        ticketId: req.params.id,
        organizationId: req.user.organization_id,
        updateData: req.body,
        updatedBy: req.user
      });

      const changes = Object.keys(req.body).join(', ');
      AuditLogService.log({
        user: req.user, action: 'Updated', resource: 'Ticket',
        target: result.data?.subject || req.params.id,
        category: 'data', ip: getIp(req),
        organizationId: req.user.organization_id,
        metadata: { ticketId: req.params.id, fields: changes },
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

  delete: async (req, res) => {
    try {
      const result = await TicketService.deleteTicket({
        ticketId: req.params.id,
        organizationId: req.user.organization_id
      });

      AuditLogService.log({
        user: req.user, action: 'Deleted', resource: 'Ticket',
        target: req.params.id, category: 'data',
        ip: getIp(req), organizationId: req.user.organization_id,
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

  addComment: async (req, res) => {
    try {
      const result = await TicketService.addComment({
        ticketId: req.params.id,
        userId: req.user._id,
        commentData: req.body,
        author: req.user
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

  getComments: async (req, res) => {
    try {
      const result = await TicketService.getTicketComments({
        ticketId: req.params.id
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

  updateComment: async (req, res) => {
    try {
      const result = await TicketService.updateComment({
        ticketId: req.params.id,
        commentId: req.params.commentId,
        userId: req.user._id,
        updateData: req.body
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

  deleteComment: async (req, res) => {
    try {
      const result = await TicketService.deleteComment({
        ticketId: req.params.id,
        commentId: req.params.commentId,
        userId: req.user._id
      });

      AuditLogService.log({
        user: req.user, action: 'Deleted', resource: 'Ticket Comment',
        target: `on ticket ${req.params.id}`, category: 'data',
        ip: getIp(req), organizationId: req.user.organization_id,
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

  bulkUpdate: async (req, res) => {
    try {
      const { ticket_ids, updates } = req.body;
      const result = await TicketService.bulkUpdateTickets({
        ticketIds: ticket_ids,
        organizationId: req.user.organization_id,
        updateData: updates
      });

      AuditLogService.log({
        user: req.user, action: 'Bulk updated', resource: 'Tickets',
        target: `${ticket_ids?.length || 0} tickets`, category: 'data',
        ip: getIp(req), organizationId: req.user.organization_id,
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
      const { ticket_ids } = req.body;
      const result = await TicketService.bulkDeleteTickets({
        ticketIds: ticket_ids,
        organizationId: req.user.organization_id
      });

      AuditLogService.log({
        user: req.user, action: 'Bulk deleted', resource: 'Tickets',
        target: `${ticket_ids?.length || 0} tickets`, category: 'data',
        ip: getIp(req), organizationId: req.user.organization_id,
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
  }
};
