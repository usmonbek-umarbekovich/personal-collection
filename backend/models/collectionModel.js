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
      maxLenght: 30,
      required: true,
    },
    topic: {
      type: String,
      lowercase: true,
      maxLenght: 30,
      required: [true, 'Please choose a topic for your collection'],
    },
    meta: {
      numItems: { type: Number, default: 0 },
    },
    description: String,
  },
  { timestamps: true }
);

schema.virtual('items', {
  ref: 'Item',
  localField: '_id',
  foreignField: 'collectionId',
});

module.exports = mongoose.model('Collection', schema);
