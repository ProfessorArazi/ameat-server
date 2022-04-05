const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGOOSE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
