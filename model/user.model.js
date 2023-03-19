const mongoose = require("mongoose");
// const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      max: 255,
      required: true,
    },
    email: {
      type: String,
      index: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    walletAddress: {
      type: String,
      required: true
    },
    balance: {
      type: Number,
      required: true
    },
    wallet: {
      type: Number,
    },
    transaction: {
      type: Array,
    },
    trades:{
      type: Array,
    },
    role: {
      type: String,
      default: "user", // types of users: user, admin
      required: true,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  { timestamps: true } // createdAt, updatedAt timestamps will be taken care of by this automatically
);

module.exports = mongoose.model("User", userSchema, "users");
