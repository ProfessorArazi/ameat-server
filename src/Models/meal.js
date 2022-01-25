const mongoose = require("mongoose");

const Meal = mongoose.model("Meal", {
  meals: {
    type: Array,
    required: true,
  },
});

module.exports = Meal;
