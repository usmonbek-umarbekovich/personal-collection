const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
      },
      date: {
        type: Date,
        default: Date.now,
        immutable: true,
      },
      body: String,
    },
  ],
  likes: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
      },
    },
  ],
  tags: [String],
});

const collectionSchema = new mongoose.Schema(
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
    items: [itemSchema],
    description: String,
    picture: Buffer,
  },
  { timestamps: true }
);

collectionSchema.index({ '$**': 'text' });

module.exports = mongoose.model('Collection', collectionSchema);
