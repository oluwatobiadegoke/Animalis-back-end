const User = require("../models/User");
const StatusCodes = require("http-status-codes");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { username, email, password, cpassword } = req.body;

  if (password !== cpassword) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, msg: "Passwords do not match." });
  }

  const userAlreadyExists = await User.findOne({ email });
  if (userAlreadyExists) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      msg: "Email already used on a different account.",
    });
  }

  const usernameTaken = await User.findOne({ username });
  if (usernameTaken) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, msg: "Username already taken." });
  }

  const newUser = await User.create(req.body);
  return res
    .status(StatusCodes.CREATED)
    .json({ success: true, msg: "User created successfully." });
};

const login = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ success: false, msg: "User not found." });
  }
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ success: false, msg: "Incorrect password." });
  }

  const token = jwt.sign(
    {
      userId: user.id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );

  return res.status(StatusCodes.OK).json({
    success: true,
    user: { userId: user.id, username: user.username },
    token,
  });
};

module.exports = {
  register,
  login,
};
