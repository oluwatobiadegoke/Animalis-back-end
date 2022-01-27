const express = require("express");
const router = express.Router();

const {
  getUser,
  updateUser,
  uploadProfilePicture,
} = require("../controllers/user");

router.route("/:id").get(getUser).patch(updateUser);
router.post("/upload/:id", uploadProfilePicture);

module.exports = router;
