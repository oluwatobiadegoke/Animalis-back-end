const StatusCodes = require("http-status-codes");

const Post = require("../models/Post");

const addComment = async (req, res) => {
  const { postId, text, userId, username } = req.body;
  if (!postId || !text) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, msg: "postId or text missing." });
  }
  try {
    const post = await Post.findOne({ _id: postId });
    if (!post) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, msg: "Post not found" });
    }
    post.comments.push({
      userId,
      username,
      text,
    });
    const updatedPost = await post.save();
    return res.status(StatusCodes.OK).json({ success: true, updatedPost });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, msg: "Post not updated" });
  }
};
const removeComment = async (req, res) => {
  const { postId } = req.params;
  const { commentId } = req.body;
  const { userId } = req.user;
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
    if (post.userId.toString() !== userId.toString()) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        msg: "You are not authorized to delete this comment",
      });
    }
    const findIndex = post.comments.findIndex(
      (comment) => comment._id === commentId
    );
    post.comments.splice(findIndex, 1);
    const updatedPost = await post.save();
    return res.status(StatusCodes.OK).json({ success: true, updatedPost });
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, msg: "Post not updated" });
  }
};

module.exports = { addComment, removeComment };
