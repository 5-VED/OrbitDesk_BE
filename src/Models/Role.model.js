const { Schema, model } = require('mongoose');
const baseFieldsSchema = require('./BaseFields.model');

const roleSchema = new Schema(
  {
    role: {
      type: Schema.Types.String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: Schema.Types.String,
      default: '',
      trim: true,
    },
    permissions: {
      type: [Schema.Types.String],
      default: [],
    },
    isSystem: {
      type: Schema.Types.Boolean,
      default: false,
    },
    ...baseFieldsSchema.obj,
  },
  {
    collection: 'Role_Master',
    timestamps: true,
  }
);

const Roles = model('Role', roleSchema);

module.exports = Roles;
