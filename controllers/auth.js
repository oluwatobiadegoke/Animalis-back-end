const User = require("../models/User");
const StatusCodes = require("http-status-codes");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { username, email } = req.body;

  const userAlreadyExists = User.findOne({ email });
  if (userAlreadyExists) {
    return res
      .status(StatusCodes.CONFLICT)
      .json({ success: false, msg: "User already exists." });
  }

  const usernameTaken = User.findOne({ username });
  if (usernameTaken) {
    return res
      .status(StatusCodes.CONFLICT)
      .json({ success: false, msg: "Username already taken." });
  }

  const newUser = await User.create(req.body);
  res
    .status(StatusCodes.CREATED)
    .json({ success: true, msg: "User created successfully." });
};

const login = (req, res) => {
  const { username, password } = req.body;

  const user = User.findOne({ username });
  if (!user) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json({ success: false, msg: "User not found." });
  }
  const isMatch = User.comparPassword(password);

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

  const oneDay = 1000 * 60 * 60 * 24;
  const longerExp = 1000 * 60 * 60 * 24 * 30;

  return res.cookie("token", token, {
    expiresIn: new Date(Date.now() + longerExp),
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    signed: true,
  });
};

module.exports = {
  register,
  login,
};
