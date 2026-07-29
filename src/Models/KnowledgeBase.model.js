const { Schema, model } = require('mongoose');
const baseFieldsSchema = require('./BaseFields.model');

const knowledgeBaseSchema = new Schema(
  {
    title: {
      type: Schema.Types.String,
      required: true,
      trim: true,
    },
    slug: {
      type: Schema.Types.String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    content: {
      type: Schema.Types.String,
      default: '',
    },
    category_id: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
    author_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    tags: [
      {
        type: Schema.Types.String,
        trim: true,
      },
    ],
    status: {
      type: Schema.Types.String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
    views: {
      type: Schema.Types.Number,
      default: 0,
    },
    is_public: {
      type: Schema.Types.Boolean,
      default: true,
    },
    ...baseFieldsSchema.obj,
  },
  {
    collection: 'KnowledgeBase_Master',
    timestamps: true,
  }
);

knowledgeBaseSchema.pre('save', function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

const KnowledgeBase = model('KnowledgeBase', knowledgeBaseSchema);

module.exports = KnowledgeBase;
