const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const schema = mongoose.Schema(
  {
    name: {
      first: {
        type: String,
        required: [true, 'First Name is a required field'],
      },
      last: {
        type: String,
        required: [true, 'Last Name is a required field'],
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
    picture: Buffer,
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: { createdAt: 'registrationTime' },
  }
);

class UserClass {
  get fullName() {
    return `${this.name.first} ${this.name.last}`;
  }
}

schema.loadClass(UserClass);
schema.plugin(passportLocalMongoose, {
  usernameField: 'email',
  selectFields: ['name', 'email', '_id'],
});

module.exports = mongoose.model('User', schema);
