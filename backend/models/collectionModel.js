const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      immutable: true,
    },
    name: {
      type: String,
      required: true,
    },
    topic: {
      type: String,
      required: [true, 'Please choose a topic for your collection'],
    },
    description: String,
    picture: Buffer,
    meta: {
      numItems: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Collection', schema);
