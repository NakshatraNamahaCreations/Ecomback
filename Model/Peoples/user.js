const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    phoneNumber: String,
    email: String,
    gender: String,
    password: String,
    dateOfBirth: Date,
    profilePicture: String,
    courseDetails: Array,
    videoDetails: Array,
    fcmToken: String,
    firebaseUserId: String,
    conversationList: [
      {
        chat: String,
        timestamp: Date,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
