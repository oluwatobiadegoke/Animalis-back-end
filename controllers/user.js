const StatusCode = require("http-status-codes");
const cloudinary = require("cloudinary").v2;

const User = require("../models/User");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

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
    const updatedUser = await User.updateOne({ _id: id }, { $set: req.body });
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
