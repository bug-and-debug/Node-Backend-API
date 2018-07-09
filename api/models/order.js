const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let Order = new Schema({
  product: {
      type: Object,
      required: true
    },
  user: {
      type: Object,
      required: true
  }
});

module.exports = mongoose.model('Order', Order);
