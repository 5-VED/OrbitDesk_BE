const { Schema, model } = require('mongoose');

const settingsSchema = new Schema(
  {
    key: {
      type: Schema.Types.String,
      required: true,
      unique: true,
      trim: true,
    },
    value: {
      type: Schema.Types.Mixed,
      required: true,
    },
    category: {
      type: Schema.Types.String,
      enum: ['general', 'security', 'email', 'notifications'],
      required: true,
    },
  },
  {
    collection: 'Settings_Master',
    timestamps: true,
  }
);

const Settings = model('Settings', settingsSchema);

module.exports = Settings;
