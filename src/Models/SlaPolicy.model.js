const { Schema, model } = require('mongoose');
const baseFieldsSchema = require('./BaseFields.model');

const slaPolicySchema = new Schema(
  {
    title: {
      type: Schema.Types.String,
      required: true,
      trim: true,
    },
    description: {
      type: Schema.Types.String,
      default: '',
      trim: true,
    },
    is_active: {
      type: Schema.Types.Boolean,
      default: true,
    },
    is_default: {
      type: Schema.Types.Boolean,
      default: false,
    },
    position: {
      type: Number,
      default: 0,
    },
    filter: {
      type: Map,
      of: Schema.Types.Mixed,
    },
    policy_metrics: [
      {
        priority: String,
        target: String,
        target_minutes: Number,
      },
    ],
    ...baseFieldsSchema.obj,
  },
  {
    collection: 'SlaPolicy_Master',
    timestamps: true,
  }
);

const SlaPolicy = model('SlaPolicy', slaPolicySchema);

module.exports = SlaPolicy;
