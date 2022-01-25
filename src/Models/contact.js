const mongoose = require("mongoose");
const validator = require("validator");

const Contact = mongoose.model("Contact", {
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("email is invalid");
      }
    },
  },
  message: {
    type: String,
    required: true,
    trim: true,
    validate(value) {
      if (value.length === 0) {
        throw new Error("empty message");
      }
    },
  },
});

module.exports = Contact;
