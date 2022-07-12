const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    lowercase: true,
    immutable: true,
    unique: true,
  },
});

module.exports = mongoose.model('Tag', schema);
