const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 7,
  },
  wallet: [
    {
      currency: {
        type: String,
        required: true,
      },
      amount: {
        type: Number,
        default: 0,
      },
    },
  ],
  // firstName: {
  //     type: String,
  //     required: true
  // },
  // lastName: {
  //     type: String,
  //     required: true
  // },
  // phoneNumber: {
  //     type: String,
  //     required: true
  // },
  // address: {
  //     type: String,
  //     required: true
  // },
  // country: {
  //     type: String,
  //     required: true
  // },
  // birthDate: {
  //     type: String,
  //     required: true
  // }
});

userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 10);
  }

  next();
});

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY, {
    expiresIn: "30m",
  });

  return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await UserModel.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password)))
    throw new Error({ error: "Invalid login credentials" });

  return user;
};

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;