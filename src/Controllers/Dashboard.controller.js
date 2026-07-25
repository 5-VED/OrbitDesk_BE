const {
  UserModel,
  TicketModel,
  OrganizationModel,
  GroupModel,
  AgentRatingModel,
  AuditLogModel,
} = require('../Models');
const messages = require('../Constants/messages');
const { HTTP_CODES, TICKET_STATUS } = require('../Constants/enums');

module.exports = {
  stats: async (req, res) => {
    try {
      const [totalUsers, totalTickets, totalOrgs, totalGroups] = await Promise.all([
        UserModel.countDocuments(),
        TicketModel.countDocuments(),
        OrganizationModel.countDocuments(),
        GroupModel.countDocuments(),
      ]);

      const [admins, agents, customers] = await Promise.all([
        UserModel.countDocuments({ role_type: 'admin' }),
        UserModel.countDocuments({ role_type: 'agent' }),
        UserModel.countDocuments({ role_type: 'customer' }),
      ]);

      const [openTickets, pendingTickets, solvedTickets] = await Promise.all([
        TicketModel.countDocuments({ status: TICKET_STATUS.OPEN }),
        TicketModel.countDocuments({ status: TICKET_STATUS.PENDING }),
        TicketModel.countDocuments({ status: TICKET_STATUS.SOLVED }),
      ]);

      const activeOrgs = await OrganizationModel.countDocuments({ is_active: true });
      const inactiveOrgs = totalOrgs - activeOrgs;

      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: messages.DASHBOARD_STATS_FETCHED,
        data: {
          systemStats: [
            {
              label: 'Total Users',
              value: totalUsers.toLocaleString(),
              icon: 'Users',
              color: 'primary',
              subtitle: `${admins} admins · ${agents} agents · ${customers} customers`,
            },
            {
              label: 'Active Tickets',
              value: (totalTickets - solvedTickets).toLocaleString(),
              icon: 'Ticket',
              color: 'warning',
              subtitle: `${openTickets} open · ${pendingTickets} pending · ${solvedTickets} solved`,
            },
            {
              label: 'Organizations',
              value: totalOrgs.toLocaleString(),
              icon: 'Building2',
              color: 'info',
              subtitle: `${activeOrgs} active · ${inactiveOrgs} inactive`,
            },
            {
              label: 'Agent Groups',
              value: totalGroups.toLocaleString(),
              icon: 'UsersRound',
              color: 'success',
              subtitle: `${agents} agents across ${totalGroups} groups`,
            },
          ],
        },
      });
    } catch (error) {
      return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: messages.INTERNAL_SERVER_ERROR,
        error,
      });
    }
  },

  slaOverview: async (req, res) => {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const tickets = await TicketModel.find({
        createdAt: { $gte: thirtyDaysAgo },
      }).select('first_response_at response_due_at solved_at resolve_due_at sla_breach_at');

      const withResponseDue = tickets.filter(t => t.response_due_at);
      const respondedOnTime = withResponseDue.filter(
        t => t.first_response_at && t.first_response_at <= t.response_due_at
      ).length;

      const withResolveDue = tickets.filter(t => t.resolve_due_at);
      const resolvedOnTime = withResolveDue.filter(
        t => t.solved_at && t.solved_at <= t.resolve_due_at
      ).length;

      const ratings = await AgentRatingModel.find({ createdAt: { $gte: thirtyDaysAgo } }).select('rating');
      const avgRating = ratings.length > 0
        ? Math.round((ratings.reduce((s, r) => s + r.rating, 0) / ratings.length / 5) * 100)
        : 0;

      const escalated = tickets.filter(t => t.sla_breach_at && t.sla_breach_at <= new Date()).length;
      const escalationRate = tickets.length > 0 ? Math.round((escalated / tickets.length) * 100) : 0;

      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: messages.DASHBOARD_STATS_FETCHED,
        data: [
          {
            label: 'First Response',
            value: withResponseDue.length > 0 ? Math.round((respondedOnTime / withResponseDue.length) * 100) : 100,
            target: 95,
            color: 'warning',
          },
          {
            label: 'Resolution Time',
            value: withResolveDue.length > 0 ? Math.round((resolvedOnTime / withResolveDue.length) * 100) : 100,
            target: 90,
            color: 'danger',
          },
          {
            label: 'Customer Satisfaction',
            value: avgRating,
            target: 85,
            color: 'success',
          },
          {
            label: 'Escalation Rate',
            value: escalationRate,
            target: 10,
            color: 'success',
            inverted: true,
          },
        ],
      });
    } catch (error) {
      return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: messages.INTERNAL_SERVER_ERROR,
        error,
      });
    }
  },

  topAgents: async (req, res) => {
    try {
      const agents = await UserModel.find({ role_type: 'agent' }).select('first_name last_name status');

      const agentStats = await Promise.all(
        agents.map(async (agent) => {
          const [assigned, resolved, ratingData] = await Promise.all([
            TicketModel.countDocuments({ assignee_id: agent._id }),
            TicketModel.countDocuments({ assignee_id: agent._id, status: TICKET_STATUS.SOLVED }),
            AgentRatingModel.aggregate([
              { $match: { agent_id: agent._id } },
              { $group: { _id: null, avg: { $avg: '$rating' } } },
            ]),
          ]);

          return {
            name: `${agent.first_name} ${agent.last_name}`,
            tickets: assigned,
            resolved,
            satisfaction: ratingData[0]?.avg?.toFixed(1) || 'N/A',
            status: agent.status || 'offline',
          };
        })
      );

      agentStats.sort((a, b) => b.resolved - a.resolved);

      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: messages.DASHBOARD_STATS_FETCHED,
        data: agentStats.slice(0, 5),
      });
    } catch (error) {
      return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: messages.INTERNAL_SERVER_ERROR,
        error,
      });
    }
  },

  recentActivity: async (req, res) => {
    try {
      let events = [];

      if (AuditLogModel) {
        events = await AuditLogModel.find()
          .sort({ createdAt: -1 })
          .limit(6)
          .lean();
      }

      const formatted = events.map((e) => ({
        id: e._id,
        user: e.performed_by_name || e.user || 'System',
        action: e.action || e.description || 'Action',
        target: e.target || e.resource || '',
        time: e.createdAt,
        type: e.category || 'general',
      }));

      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: messages.DASHBOARD_STATS_FETCHED,
        data: formatted,
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
