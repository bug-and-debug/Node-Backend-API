const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let Product = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  imageUrl: {
    type: String
  },
  price: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: Object,
    required: true
  }
});

module.exports = mongoose.model('Product', Product);
