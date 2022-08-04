const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const schema = new mongoose.Schema(
  {
    name: {
      first: {
        type: String,
        maxLength: 20,
        required: [true, 'First Name is a required field'],
      },
      last: {
        type: String,
        maxLength: 20,
        required: [true, 'Last Name is a required field'],
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      maxLength: 30,
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
    active: {
      type: Boolean,
      default: true,
    },
    bio: {
      type: String,
      maxLength: 250,
    },
    avatar: Buffer,
  },
  {
    timestamps: { createdAt: 'registrationTime' },
  }
);

schema.virtual('collections', {
  ref: 'Collection',
  localField: '_id',
  foreignField: 'user',
});

schema.plugin(passportLocalMongoose, {
  usernameField: 'email',
  selectFields: ['name', 'email', '_id'],
});

module.exports = mongoose.model('User', schema);
