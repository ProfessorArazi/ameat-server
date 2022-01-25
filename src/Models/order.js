const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderedItems: {
    type: Array,
    required: true,
  },
  user: {
    type: Object,
    required: true,
  },
  totalPrice: {
    type: Number,
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
