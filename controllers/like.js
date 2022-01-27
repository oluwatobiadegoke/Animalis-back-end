const StatusCodes = require("http-status-codes");

const Post = require("../models/Post");

const addLike = async (req, res) => {
  const { postId, userId } = req.body;
  if (!postId) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, msg: "postId missing." });
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
    });
    const updatedPost = await post.save();
    res.status(StatusCodes.OK).json({ success: true, updatedPost });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, msg: "Like not updated" });
  }
};

module.exports = addLike;
