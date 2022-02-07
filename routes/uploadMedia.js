const express = require("express");
const router = express.Router();

const uploadMedia = require("../controllers/uploadMedia");

router.route("/media").post(uploadMedia);

module.exports = router;
