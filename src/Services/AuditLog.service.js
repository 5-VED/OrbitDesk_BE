const AuditLogRepository = require('../Repository/AuditLog.repository');

const log = async ({ user, action, resource, target, category, metadata, ip, organizationId }) => {
    try {
        await AuditLogRepository.create({
            user_id: user?._id || null,
            user_name: user
                ? (`${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email || 'Unknown')
                : 'System',
            user_role: user?.role || 'system',
            action,
            resource,
            target: target || '',
            category: category || 'data',
            ip_address: ip || '—',
            metadata: metadata || {},
            organization_id: organizationId || user?.organization_id || null,
        });
    } catch (err) {
        console.error('Audit log write failed:', err.message);
    }
};

const list = async ({ organizationId, search, category, page = 1, limit = 50 }) => {
    const filter = {};
    if (organizationId) filter.organization_id = organizationId;
    if (category) filter.category = category;
    if (search) {
        filter.$or = [
            { user_name: { $regex: search, $options: 'i' } },
            { action: { $regex: search, $options: 'i' } },
            { target: { $regex: search, $options: 'i' } },
            { resource: { $regex: search, $options: 'i' } },
        ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [logs, total] = await Promise.all([
        AuditLogRepository.findAll(filter, { skip, limit: Number(limit) }),
        AuditLogRepository.count(filter),
    ]);

    return {
        message: 'Audit logs retrieved',
        data: {
            logs,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                totalPages: Math.ceil(total / Number(limit)),
            },
        },
    };
};

const exportLogs = async ({ organizationId, search, category }) => {
    const filter = {};
    if (organizationId) filter.organization_id = organizationId;
    if (category) filter.category = category;
    if (search) {
        filter.$or = [
            { user_name: { $regex: search, $options: 'i' } },
            { action: { $regex: search, $options: 'i' } },
            { target: { $regex: search, $options: 'i' } },
            { resource: { $regex: search, $options: 'i' } },
        ];
    }

    const logs = await AuditLogRepository.findAll(filter, { skip: 0, limit: 10000 });

    const rows = [['Timestamp', 'User', 'Role', 'Action', 'Resource', 'Target', 'Category', 'IP Address']];
    logs.forEach((l) => {
        rows.push([
            l.createdAt ? new Date(l.createdAt).toISOString() : '',
            l.user_name,
            l.user_role,
            l.action,
            l.resource,
            l.target,
            l.category,
            l.ip_address,
        ]);
    });

    return rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
};

module.exports = { log, list, exportLogs };
