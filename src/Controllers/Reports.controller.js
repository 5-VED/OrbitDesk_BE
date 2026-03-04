const { TicketModel, UserModel, AgentRatingModel } = require('../Models');
const messages = require('../Constants/messages');
const { HTTP_CODES, TICKET_STATUS } = require('../Constants/enums');

function getDateRange(range) {
  const now = new Date();
  const start = new Date();
  switch (range) {
    case '7d': start.setDate(now.getDate() - 7); break;
    case '30d': start.setDate(now.getDate() - 30); break;
    case '90d': start.setDate(now.getDate() - 90); break;
    default: start.setDate(now.getDate() - 7);
  }
  return { start, end: now };
}

module.exports = {
  summary: async (req, res) => {
    try {
      const { range = '7d' } = req.query;
      const { start, end } = getDateRange(range);

      const prevStart = new Date(start);
      prevStart.setTime(prevStart.getTime() - (end.getTime() - start.getTime()));

      const [currentTickets, previousTickets, resolvedCurrent, resolvedPrev, allRatings] = await Promise.all([
        TicketModel.countDocuments({ createdAt: { $gte: start, $lte: end } }),
        TicketModel.countDocuments({ createdAt: { $gte: prevStart, $lt: start } }),
        TicketModel.countDocuments({ status: TICKET_STATUS.SOLVED, solved_at: { $gte: start, $lte: end } }),
        TicketModel.countDocuments({ status: TICKET_STATUS.SOLVED, solved_at: { $gte: prevStart, $lt: start } }),
        AgentRatingModel.find({ createdAt: { $gte: start, $lte: end } }).select('rating'),
      ]);

      const ticketChange = previousTickets > 0 ? (((currentTickets - previousTickets) / previousTickets) * 100).toFixed(1) : 0;
      const resolvedChange = resolvedPrev > 0 ? (((resolvedCurrent - resolvedPrev) / resolvedPrev) * 100).toFixed(1) : 0;
      const avgSatisfaction = allRatings.length > 0
        ? ((allRatings.reduce((s, r) => s + r.rating, 0) / allRatings.length / 5) * 100).toFixed(0)
        : 0;

      const resolvedTickets = await TicketModel.find({
        status: TICKET_STATUS.SOLVED,
        solved_at: { $gte: start, $lte: end },
        first_response_at: { $ne: null },
      }).select('first_response_at createdAt');

      const fcrCount = resolvedTickets.filter(t => {
        const diff = t.first_response_at - t.createdAt;
        return diff < 24 * 60 * 60 * 1000;
      }).length;
      const fcrRate = resolvedCurrent > 0 ? ((fcrCount / resolvedCurrent) * 100).toFixed(0) : 0;

      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: messages.REPORTS_FETCHED_SUCCESS,
        data: {
          totalTickets: { value: currentTickets, change: parseFloat(ticketChange) },
          resolvedTickets: { value: resolvedCurrent, change: parseFloat(resolvedChange) },
          satisfaction: { value: `${avgSatisfaction}%`, change: 0 },
          firstContactResolution: { value: `${fcrRate}%`, change: 0 },
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

  ticketTrends: async (req, res) => {
    try {
      const { range = '7d' } = req.query;
      const { start, end } = getDateRange(range);

      const [created, resolved] = await Promise.all([
        TicketModel.aggregate([
          { $match: { createdAt: { $gte: start, $lte: end } } },
          { $group: { _id: { $dayOfWeek: '$createdAt' }, count: { $sum: 1 } } },
          { $sort: { _id: 1 } },
        ]),
        TicketModel.aggregate([
          { $match: { status: TICKET_STATUS.SOLVED, solved_at: { $gte: start, $lte: end } } },
          { $group: { _id: { $dayOfWeek: '$solved_at' }, count: { $sum: 1 } } },
          { $sort: { _id: 1 } },
        ]),
      ]);

      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const data = days.map((name, i) => ({
        name,
        created: created.find(c => c._id === i + 1)?.count || 0,
        resolved: resolved.find(r => r._id === i + 1)?.count || 0,
      }));

      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: messages.REPORTS_FETCHED_SUCCESS,
        data,
      });
    } catch (error) {
      return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: messages.INTERNAL_SERVER_ERROR,
        error,
      });
    }
  },

  agentPerformance: async (req, res) => {
    try {
      const { range = '7d' } = req.query;
      const { start, end } = getDateRange(range);

      const agents = await UserModel.find({ role_type: 'agent' }).select('first_name last_name');

      const performance = await Promise.all(
        agents.map(async (agent) => {
          const [ticketCount, ratingData] = await Promise.all([
            TicketModel.countDocuments({ assignee_id: agent._id, createdAt: { $gte: start, $lte: end } }),
            AgentRatingModel.aggregate([
              { $match: { agent_id: agent._id, createdAt: { $gte: start, $lte: end } } },
              { $group: { _id: null, avg: { $avg: '$rating' } } },
            ]),
          ]);

          const slaCompliance = await TicketModel.countDocuments({
            assignee_id: agent._id,
            createdAt: { $gte: start, $lte: end },
            $or: [{ sla_breach_at: null }, { sla_breach_at: { $gt: new Date() } }],
          });

          const slaRate = ticketCount > 0 ? Math.round((slaCompliance / ticketCount) * 100) : 100;

          return {
            name: agent.first_name,
            tickets: ticketCount,
            sla: slaRate,
            rating: ratingData[0]?.avg?.toFixed(1) || 'N/A',
          };
        })
      );

      performance.sort((a, b) => b.tickets - a.tickets);

      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: messages.REPORTS_FETCHED_SUCCESS,
        data: performance.slice(0, 10),
      });
    } catch (error) {
      return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: messages.INTERNAL_SERVER_ERROR,
        error,
      });
    }
  },

  channelDistribution: async (req, res) => {
    try {
      const { range = '7d' } = req.query;
      const { start, end } = getDateRange(range);

      const channels = await TicketModel.aggregate([
        { $match: { createdAt: { $gte: start, $lte: end } } },
        { $group: { _id: '$channel', count: { $sum: 1 } } },
      ]);

      const total = channels.reduce((s, c) => s + c.count, 0);
      const colorMap = { email: '#3b82f6', chat: '#10b981', phone: '#f59e0b', web: '#8b5cf6', api: '#ef4444' };

      const data = channels.map(c => ({
        name: (c._id || 'unknown').charAt(0).toUpperCase() + (c._id || 'unknown').slice(1),
        value: total > 0 ? Math.round((c.count / total) * 100) : 0,
        color: colorMap[c._id] || '#6b7280',
      }));

      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: messages.REPORTS_FETCHED_SUCCESS,
        data,
      });
    } catch (error) {
      return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: messages.INTERNAL_SERVER_ERROR,
        error,
      });
    }
  },

  slaCompliance: async (req, res) => {
    try {
      const { range = '30d' } = req.query;
      const { start, end } = getDateRange(range);

      const weeks = [];
      const weekMs = 7 * 24 * 60 * 60 * 1000;
      let weekStart = new Date(start);
      let weekNum = 1;

      while (weekStart < end) {
        const weekEnd = new Date(Math.min(weekStart.getTime() + weekMs, end.getTime()));

        const [total, respondedOnTime, resolvedOnTime] = await Promise.all([
          TicketModel.countDocuments({ createdAt: { $gte: weekStart, $lt: weekEnd } }),
          TicketModel.countDocuments({
            createdAt: { $gte: weekStart, $lt: weekEnd },
            first_response_at: { $ne: null },
            $expr: { $lte: ['$first_response_at', '$response_due_at'] },
          }),
          TicketModel.countDocuments({
            createdAt: { $gte: weekStart, $lt: weekEnd },
            status: TICKET_STATUS.SOLVED,
            solved_at: { $ne: null },
            $expr: { $lte: ['$solved_at', '$resolve_due_at'] },
          }),
        ]);

        weeks.push({
          name: `Week ${weekNum}`,
          firstResponse: total > 0 ? Math.round((respondedOnTime / total) * 100) : 100,
          resolution: total > 0 ? Math.round((resolvedOnTime / total) * 100) : 100,
        });

        weekStart = weekEnd;
        weekNum++;
      }

      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: messages.REPORTS_FETCHED_SUCCESS,
        data: weeks,
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
