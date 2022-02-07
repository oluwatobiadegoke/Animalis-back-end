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
      res
        .status(StatusCode.BAD_REQUEST)
        .json({ success: false, msg: "User not found" });
    }
    res.status(StatusCode.OK).json({ success: true, user });
  } catch (error) {
    res
      .status(StatusCode.INTERNAL_SERVER_ERROR)
      .json({ success: false, msg: "Something went wrong!" });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ _id: id });
    if (!user) {
      res
        .status(StatusCode.BAD_REQUEST)
        .json({ success: false, msg: "User not found" });
    }
    const updatedUser = await User.updateOne({ _id: id }, { $set: req.body });
    res.status(StatusCode.OK).json({ success: true, user: updatedUser });
  } catch (error) {
    res
      .status(StatusCode.INTERNAL_SERVER_ERROR)
      .json({ success: false, msg: "Something went wrong!" });
  }
};

// const uploadProfilePicture = async (req, res) => {
//   const { id } = req.params;
//   const { avatar } = req.body;
//   if (!avatar) {
//     res
//       .status(StatusCode.BAD_REQUEST)
//       .json({ success: false, msg: "Avatar missing" });
//   }
//   try {
//     const user = await User.findOne({ _id: id });
//     if (!user) {
//       res
//         .status(StatusCode.BAD_REQUEST)
//         .json({ success: false, msg: "User not found" });
//     }
//     cloudinary.uploader.upload(avatar, (err, result) => {
//       if (err) {
//         res
//           .status(StatusCodes.INTERNAL_SERVER_ERROR)
//           .json({ success: false, msg: "Post not uploaded" });
//       }
//       user.avatar = result.secure_url;
//       const newUser = user.save();
//       res.status(StatusCode.OK).json({ success: true, newUser });
//     });
//   } catch (error) {}
// };

module.exports = {
  getUser,
  updateUser,
};
