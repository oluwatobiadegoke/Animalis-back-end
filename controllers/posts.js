const StatusCodes = require("http-status-codes");

const Post = require("../models/Post");

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({});
    return res.status(StatusCodes.OK).json({ success: true, posts });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, msg: "Posts not fetched" });
  }
};

const getPost = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, msg: "id missing." });
  }
  try {
    const post = await Post.findOne({ _id: id });
    return res.status(StatusCodes.OK).json({ success: true, post });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, msg: "Post not fetched" });
  }
};

const uploadPost = async (req, res) => {
  try {
    const newPost = await Post.create(req.body);
    return res.status(StatusCodes.OK).json({ success: true, newPost });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, msg: "Post not uploaded" });
  }
};

const deletePost = async (req, res) => {
  const { postId, userId } = req.params;
  if (!userId) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, msg: "userId missing." });
  }
  if (!postId) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, msg: "postId missing." });
  }
  let post;
  try {
    post = await Post.findOne({ _id: postId });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, msg: "Post not found" });
  }
  if (post.user.toString() !== userId) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, msg: "You cannot delete this post" });
  }
  try {
    const deletedPost = await Post.findByIdAndDelete(postId);
    return res
      .status(StatusCodes.OK)
      .json({ success: true, msg: "Post deleted", deletedPost });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, msg: "Post not deleted" });
  }
};

const getAllIndividualPosts = async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, msg: "userId missing." });
  }
  try {
    const posts = await Post.find({ user: userId });
    return res.status(StatusCodes.OK).json({ success: true, posts });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, msg: "Posts not fetched" });
  }
};

module.exports = {
  getAllPosts,
  getPost,
  uploadPost,
  deletePost,
  getAllIndividualPosts,
};
