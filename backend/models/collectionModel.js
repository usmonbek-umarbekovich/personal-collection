const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
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

module.exports = mongoose.model('Collection', schema);
