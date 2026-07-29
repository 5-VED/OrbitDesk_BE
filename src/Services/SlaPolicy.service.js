const SlaPolicyRepository = require('../Repository/SlaPolicy.repository');
const TicketRepository = require('../Repository/Ticket.repository');
const { BusinessHoursModel } = require('../Models');
const { calculateDueDate } = require('../Utils/businessHours');
const messages = require('../Constants/messages');
const { HTTP_CODES } = require('../Constants/enums');

const createPolicy = async (payload) => {
    // Logic to ensure position is correct (add to end)
    const count = await SlaPolicyRepository.count({ is_deleted: false });
    if (!payload.position) {
        payload.position = count; // 0-indexed, so count is next position
    }

    const result = await SlaPolicyRepository.create(payload);

    return {
        message: 'SLA Policy created successfully',
        data: result,
    };
};

const getPolicy = async (id) => {
    const policy = await SlaPolicyRepository.findById(id);
    if (!policy || policy.is_deleted) {
        throw {
            statusCode: HTTP_CODES.NOT_FOUND,
            message: 'SLA Policy not found',
        };
    }
    return policy;
};

const listPolicies = async (query = {}) => {
    const filter = { is_deleted: false };
    if (query.search) {
        filter.title = { $regex: query.search, $options: 'i' };
    }

    const sort = { position: 1 }; // Default sort by position

    const policies = await SlaPolicyRepository.findAll(filter, sort);
    return {
        message: 'SLA Policies retrieved successfully',
        data: policies
    };
};

const updatePolicy = async (id, payload) => {
    const existing = await SlaPolicyRepository.findById(id);
    if (!existing || existing.is_deleted) {
        throw {
            statusCode: HTTP_CODES.NOT_FOUND,
            message: 'SLA Policy not found',
        };
    }

    const result = await SlaPolicyRepository.updateById(id, payload);
    return {
        message: 'SLA Policy updated successfully',
        data: result,
    };
};

const deletePolicy = async (id) => {
    const existing = await SlaPolicyRepository.findById(id);
    if (!existing) {
        throw {
            statusCode: HTTP_CODES.NOT_FOUND,
            message: 'SLA Policy not found',
        };
    }

    await SlaPolicyRepository.deleteById(id);
    return {
        message: 'SLA Policy deleted successfully',
        data: {}
    };
};

const reorderPolicies = async (orderedIds) => {
    // orderedIds is an array of strings ["id1", "id2", "id3"] representing new order
    if (!Array.isArray(orderedIds)) {
        throw {
            statusCode: HTTP_CODES.BAD_REQUEST,
            message: 'Invalid input for reordering',
        };
    }

    const promises = orderedIds.map((id, index) => {
        return SlaPolicyRepository.updateById(id, { position: index });
    });

    await Promise.all(promises);

    return {
        message: 'SLA Policies reordered successfully',
        data: {}
    };
};



// Helper: Check if ticket matches policy filter
const ticketMatchesPolicy = (ticket, policy) => {
    if (!policy.filter || policy.filter.size === 0) return true; // Default policy (no filter) matches everything if it's last

    // Basic matching for now
    // policy.filter is a Mongoose Map, so use .get()
    const priorityFilter = policy.filter.get('priority');
    if (priorityFilter && ticket.priority !== priorityFilter) return false;

    const groupFilter = policy.filter.get('group_id');
    if (groupFilter && String(ticket.group_id) !== String(groupFilter)) return false;

    const typeFilter = policy.filter.get('type');
    if (typeFilter && ticket.type !== typeFilter) return false;

    const sourceFilter = policy.filter.get('source'); // or channel
    if (sourceFilter && ticket.channel !== sourceFilter) return false;

    return true;
};

const calculateSlaTargets = async (ticket) => {
    const policies = await SlaPolicyRepository.findAll({ is_deleted: false, is_active: { $ne: false } }, { position: 1 });

    let appliedPolicy = null;
    for (const policy of policies) {
        if (ticketMatchesPolicy(ticket, policy)) {
            appliedPolicy = policy;
            break;
        }
    }

    if (!appliedPolicy) return null;

    const metric = appliedPolicy.policy_metrics.find(m => m.priority === ticket.priority);
    if (!metric) return { policy_id: appliedPolicy._id };

    const now = new Date();
    const organizationId = ticket.organization_id;

    const businessHours = organizationId
        ? await BusinessHoursModel.findOne({ organization_id: organizationId, is_default: true, is_deleted: false })
        : null;

    const responseMetric = appliedPolicy.policy_metrics.find(m => m.priority === ticket.priority && m.target === 'first_reply_time');
    const resolveMetric = appliedPolicy.policy_metrics.find(m => m.priority === ticket.priority && m.target === 'resolution_time');

    let responseDue = null;
    let resolveDue = null;

    if (responseMetric && responseMetric.target_minutes) {
        responseDue = calculateDueDate(now, responseMetric.target_minutes, businessHours);
    }

    if (resolveMetric && resolveMetric.target_minutes) {
        resolveDue = calculateDueDate(now, resolveMetric.target_minutes, businessHours);
    }

    return {
        policy_id: appliedPolicy._id,
        response_due_at: responseDue,
        resolve_due_at: resolveDue
    };
};

const getMetrics = async (organizationId) => {
    const [slaCompliance, ticketStats, policies, ticketsByPolicy] = await Promise.all([
        TicketRepository.getSlaComplianceStats(organizationId),
        TicketRepository.getTicketStatsForOrg(organizationId),
        SlaPolicyRepository.findAll({ is_deleted: false }, { position: 1 }),
        TicketRepository.getTicketCountsByPolicy(organizationId),
    ]);

    const policyMap = {};
    ticketsByPolicy.forEach((item) => {
        policyMap[item._id.toString()] = item;
    });

    const policiesWithCompliance = policies.map((p) => {
        const stats = policyMap[p._id.toString()] || { total: 0, breached: 0, resolvedOnTime: 0, resolved: 0 };
        const compliance = stats.resolved > 0
            ? Math.round((stats.resolvedOnTime / stats.resolved) * 100)
            : null;
        return {
            _id: p._id,
            title: p.title,
            compliance,
            ticketCount: stats.total,
        };
    });

    const avgCompliance = policiesWithCompliance.filter((p) => p.compliance !== null);
    const overallCompliance = avgCompliance.length > 0
        ? Math.round(avgCompliance.reduce((sum, p) => sum + p.compliance, 0) / avgCompliance.length)
        : 0;

    const avgResponseHours = slaCompliance.avgResponseMinutes > 0
        ? (slaCompliance.avgResponseMinutes / 60).toFixed(1)
        : '0';

    return {
        message: 'SLA metrics retrieved successfully',
        data: {
            overallCompliance,
            breachesToday: ticketStats.breachesToday || 0,
            avgResponseTime: `${avgResponseHours}h`,
            activePolicies: policies.filter((p) => p.is_active !== false).length,
            firstResponseCompliance: slaCompliance.firstResponseCompliance,
            resolutionCompliance: slaCompliance.resolutionCompliance,
            ticketStats: {
                open: ticketStats.open || 0,
                pending: ticketStats.pending || 0,
                overdue: ticketStats.overdue || 0,
                resolvedToday: ticketStats.resolvedToday || 0,
            },
            policiesCompliance: policiesWithCompliance,
        },
    };
};

const getDashboardStats = async (organizationId) => {
    const [ticketStats, slaCompliance] = await Promise.all([
        TicketRepository.getTicketStatsForOrg(organizationId),
        TicketRepository.getSlaComplianceStats(organizationId),
    ]);

    return {
        message: 'Dashboard stats retrieved',
        data: {
            ticketStats: {
                open: ticketStats.open || 0,
                pending: ticketStats.pending || 0,
                overdue: ticketStats.overdue || 0,
                resolvedToday: ticketStats.resolvedToday || 0,
            },
            slaCompliance: {
                firstResponse: slaCompliance.firstResponseCompliance,
                resolution: slaCompliance.resolutionCompliance,
                avgResponseMinutes: slaCompliance.avgResponseMinutes,
            },
        },
    };
};

module.exports = {
    createPolicy,
    getPolicy,
    listPolicies,
    updatePolicy,
    deletePolicy,
    reorderPolicies,
    calculateSlaTargets,
    getMetrics,
    getDashboardStats,
};
