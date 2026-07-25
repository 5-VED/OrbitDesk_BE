const { Schema, model } = require('mongoose');

const auditLogSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    user_name: { type: Schema.Types.String, default: 'System' },
    user_role: { type: Schema.Types.String, default: 'system' },
    action: { type: Schema.Types.String, required: true, trim: true },
    resource: { type: Schema.Types.String, required: true, trim: true },
    target: { type: Schema.Types.String, default: '', trim: true },
    category: {
      type: Schema.Types.String,
      enum: ['user', 'security', 'policy', 'data', 'automation', 'notification', 'settings'],
      default: 'data',
    },
    ip_address: { type: Schema.Types.String, default: '—' },
    metadata: { type: Schema.Types.Mixed, default: {} },
    organization_id: { type: Schema.Types.ObjectId, ref: 'Organization', default: null },
  },
  {
    collection: 'Audit_Log_Master',
    timestamps: true,
  }
);

auditLogSchema.index({ organization_id: 1, createdAt: -1 });
auditLogSchema.index({ category: 1 });
auditLogSchema.index({ user_id: 1 });

module.exports = model('AuditLog', auditLogSchema);
