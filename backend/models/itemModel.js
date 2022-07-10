const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    collection: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: 'Collection',
    },
    name: {
      type: String,
      required: true,
    },
    comments: [
      {
        user: {
          type: mongoose.SchemaTypes.ObjectId,
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
          type: mongoose.SchemaTypes.ObjectId,
          required: true,
          ref: 'User',
        },
      },
    ],
    tags: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Item', schema);
