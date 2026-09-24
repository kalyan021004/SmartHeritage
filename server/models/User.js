const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  password: {
    type: String,
  },

  role: {
    type: String,
    default: "user"
  },
  firebaseUid: {
      type: String,
      default: null
    },

    profileImage: {
      type: String,
      default: null
    },

    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local"
    }


}, {
  timestamps: true
});

module.exports = mongoose.model(
  "User",
  userSchema
);