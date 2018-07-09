const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let Category = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  }
});

module.exports = mongoose.model('Category', Category);
