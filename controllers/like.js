const StatusCodes = require("http-status-codes");

const Post = require("../models/Post");

const addLike = async (req, res) => {
  const { postId, userId } = req.body;
  if (!postId) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, msg: "postId missing." });
  }
  try {
    const post = await Post.findOne({ _id: postId });
    if (!post) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, msg: "Post not found" });
    }
    post.likes.push({
      userId,
    });
    const updatedPost = await post.save();
    return res.status(StatusCodes.OK).json({ success: true, updatedPost });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, msg: "Like not updated" });
  }
};

const removeLike = async (req, res) => {
  const { postId, userId } = req.body;
  if (!postId) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, msg: "postId missing." });
  }
  try {
    const post = await Post.findOne({ _id: postId });
    if (!post) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, msg: "Post not found" });
    }
    const findIndex = post.likes.findIndex((like) => like.userId === userId);
    if (findIndex === -1) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, msg: "Like not found" });
    }
    post.likes.splice(findIndex, 1);
    const updatedPost = await post.save();
    return res.status(StatusCodes.OK).json({ success: true, updatedPost });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, msg: "Like not updated" });
  }
};

module.exports = { addLike, removeLike };
