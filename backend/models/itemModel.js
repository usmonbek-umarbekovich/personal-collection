const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    collectionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Collection',
      immutable: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      immutable: true,
    },
    name: {
      type: String,
      maxLength: 30,
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
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        immutable: true,
      },
    ],
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag',
      },
    ],
    description: String,
    picture: Buffer,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Item', schema);
