const mongoose = require('mongoose');

const triggerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String
  },
  conditions: [{
    field: String,
    operator: String,
    value: String
  }],
  actions: [{
    type: { type: String },
    target: String,
    value: String
  }],
  is_active: {
    type: Boolean,
    default: true
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Trigger', triggerSchema);
