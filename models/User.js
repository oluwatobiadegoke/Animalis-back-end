const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please provide a username."],
      minLength: 5,
      maxLength: 15,
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Please provide an email."],
      unique: true,
    },
    password: {
      minlength: 8,
      type: String,
      required: [true, "Please provide a password."],
    },
    avatar: {
      type: String,
    },
    bio: {
      type: String,
      max: 50,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = bcrypt.genSalt(10);
  this.password = bcrypt.hash(this.password, salt);
});

UserSchema.method.comparePassword = async function (candidatePassword) {
  const matches = await bcrypt.compare(candidatePassword, this.password);
  return matches;
};

module.exports = mongoose.model("User", UserSchema);
