const StatusCode = require("http-status-codes");

const User = require("../models/User");
const Post = require("../models/Post");

const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ _id: id });
    if (!user) {
      return res
        .status(StatusCode.BAD_REQUEST)
        .json({ success: false, msg: "User not found" });
    }
    return res.status(StatusCode.OK).json({ success: true, user });
  } catch (error) {
    return res
      .status(StatusCode.INTERNAL_SERVER_ERROR)
      .json({ success: false, msg: "Something went wrong!" });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ _id: id });
    if (!user) {
      return res
        .status(StatusCode.BAD_REQUEST)
        .json({ success: false, msg: "User not found" });
    }
    const updatedUser = await User.updateOne(
      { _id: id },
      { $set: req.body },
      {
        new: true,
        runValidators: true,
      }
    );
    try {
      await Post.updateMany(
        { userId: id },
        { $set: { userAvatar: req.body.avatar } }
      );
    } catch (error) {
      return res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ success: false, msg: "Something went wrong!" });
    }
    return res.status(StatusCode.OK).json({ success: true, user: updatedUser });
  } catch (error) {
    return res
      .status(StatusCode.INTERNAL_SERVER_ERROR)
      .json({ success: false, msg: "Something went wrong!" });
  }
};

module.exports = {
  getUser,
  updateUser,
};
