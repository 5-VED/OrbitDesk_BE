const { Schema, model } = require('mongoose');
const baseFieldsSchema = require('./BaseFields.model');

const businessHoursSchema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      required: true,
      trim: true,
    },
    timezone: {
      type: Schema.Types.String,
      default: 'UTC',
    },
    monday: {
      enabled: { type: Boolean, default: true },
      start: { type: String, default: '09:00' },
      end: { type: String, default: '17:00' },
    },
    tuesday: {
      enabled: { type: Boolean, default: true },
      start: { type: String, default: '09:00' },
      end: { type: String, default: '17:00' },
    },
    wednesday: {
      enabled: { type: Boolean, default: true },
      start: { type: String, default: '09:00' },
      end: { type: String, default: '17:00' },
    },
    thursday: {
      enabled: { type: Boolean, default: true },
      start: { type: String, default: '09:00' },
      end: { type: String, default: '17:00' },
    },
    friday: {
      enabled: { type: Boolean, default: true },
      start: { type: String, default: '09:00' },
      end: { type: String, default: '17:00' },
    },
    saturday: {
      enabled: { type: Boolean, default: false },
      start: { type: String, default: '09:00' },
      end: { type: String, default: '13:00' },
    },
    sunday: {
      enabled: { type: Boolean, default: false },
      start: { type: String, default: '09:00' },
      end: { type: String, default: '13:00' },
    },
    holidays: [
      {
        date: { type: Date },
        label: { type: String },
      },
    ],
    is_default: {
      type: Schema.Types.Boolean,
      default: false,
    },
    organization_id: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      default: null,
    },
    ...baseFieldsSchema.obj,
  },
  {
    collection: 'BusinessHours_Master',
    timestamps: true,
  }
);

const BusinessHours = model('BusinessHours', businessHoursSchema);

module.exports = BusinessHours;
