const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(
  "mongodb+srv://Ameat:Amit1122@cluster0.i7hkh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
