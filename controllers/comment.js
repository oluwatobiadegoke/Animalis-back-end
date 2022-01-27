const StatusCodes = require("http-status-codes");

const Post = require("../models/Post");

const addComment = async (req, res) => {
  const { postId, text, userId, username } = req.body;
  if (!postId || !text) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, msg: "postId or text missing." });
  }
  try {
    const post = await Post.findOne({ _id: postId });
    if (!post) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, msg: "Post not found" });
    }
    post.comments.push({
      userId,
      username,
      userAvatar: req.userAvatar || "",
      text,
      date: Date.now(),
    });
    const updatedPost = await post.save();
    res.status(StatusCodes.OK).json({ success: true, updatedPost });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, msg: "Post not updated" });
  }
};

module.exports = addComment;
