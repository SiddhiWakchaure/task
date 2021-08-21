const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 32,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Please check and re-enter the email.");
        }
      },
    },
    mobile: {
      type: Number,
      trim: true,
      required: true,
      validate(value) {
        if (!validator.isMobilePhone(value.toString())) {
          throw new Error("Please check and re-enter the mobile number."); //validates all mobile numbers over the globe.
        }
      },
    },
    password: {
      type: String,
      trim: true,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error(
            "Please re-enter password with minimum 1 uppercase-lowercase letter, number, special character."
          );
        }
      },
    },
    tokens: [
      {
        token: {
          required: true,
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

//generated session token of user when signed up and logged in
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, "thisisanuser");

  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

// Finds user when login credentials are given.
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Unable to login.");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("unable to login.");
  }

  return user;
};

// Hashes the user's plain text password or security
userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
