const { Schema, model } = require('mongoose');

const agentRatingSchema = new Schema(
  {
    ticket_id: {
      type: Schema.Types.ObjectId,
      ref: 'Ticket',
      required: true,
    },
    agent_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rated_by: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Schema.Types.Number,
      required: true,
      min: 1,
      max: 5,
    },
    feedback: {
      type: Schema.Types.String,
      default: '',
      trim: true,
    },
  },
  {
    collection: 'Agent_Rating_Master',
    timestamps: true,
  }
);

agentRatingSchema.index({ ticket_id: 1, rated_by: 1 }, { unique: true });
agentRatingSchema.index({ agent_id: 1 });

const AgentRating = model('AgentRating', agentRatingSchema);

module.exports = AgentRating;
