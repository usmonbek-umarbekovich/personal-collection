const mongoose = require('mongoose');

const schema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
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
  },
  { timestamps: true }
);

schema.index({ name: 'text', topic: 'text' });

module.exports = mongoose.model('Collection', schema);
