const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    collectionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Collection',
      immutable: true,
    },
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
          immutable: true,
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
          immutable: true,
        },
      },
    ],
    tags: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Item', schema);
