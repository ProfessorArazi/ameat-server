const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
    validate(value) {
      if (value.length === 0) {
        throw new Error("nothing here");
      }
    },
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("email is invalid");
      }
    },
  },
  birthday: {
    type: Date,
    required: true,
    validate(value) {
      if (!validator.isDate(value)) {
        throw new Error("invalid date");
      }
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    trim: true,
    validate(value) {
      if (value.length < 8) {
        throw new Error("invalid password");
      }
    },
  },
  points: {
    type: Number,
    default: 0,
  },
  redeemed: {
    type: Boolean,
    default: false,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

userSchema.plugin(uniqueValidator);

userSchema.methods.generateAuthToken = async function () {
  try {
    if (this.tokens.length > 0) {
      return this.tokens[0];
    }
    const token = jwt.sign(
      { _id: this._id.toString() },
      "ilovesoccerandbasketball",
      { expiresIn: "1h" }
    );
    this.tokens = this.tokens.concat({ token });
    await this.save();
    return this.tokens[0];
  } catch (e) {
    console.log(e);
  }
};

userSchema.statics.findByCredentials = async (email, password) => {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("Unable to login");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Unable to login");
    }
    return user;
  } catch (e) {
    return e;
  }
};

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
