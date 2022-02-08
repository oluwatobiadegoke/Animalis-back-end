const User = require("../models/User");
const StatusCodes = require("http-status-codes");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { username, email, password, cpassword } = req.body;

  if (password !== cpassword) {
    res
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
  res
    .status(StatusCodes.CREATED)
    .json({ success: true, msg: "User created successfully." });
};

const login = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json({ success: false, msg: "User not found." });
  }
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    res
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
  const longerExp = 1000 * 60 * 60 * 24 * 30;

  res.cookie("token", token, {
    expiresIn: new Date(Date.now() + longerExp),
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    signed: true,
  });
  res
    .status(StatusCodes.OK)
    .json({
      success: true,
      user: { userId: user.id, username: user.username },
    });
};

module.exports = {
  register,
  login,
};
