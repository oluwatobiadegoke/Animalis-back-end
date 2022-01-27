const mongoose = require("mongoose");

const User = require("./User");

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    userAvatar: {
      type: String,
      default: "",
    },
    words: {
      type: String,
      required: [true, "Say something."],
    },
    media: {
      type: String,
      default: "",
    },
    likes: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    comments: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        username: {
          type: String,
          required: true,
        },
        userAvatar: {
          type: String,
          default: "",
        },
        text: {
          type: String,
          required: [true, "Please provide a comment."],
        },

        date: Date,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", PostSchema);
