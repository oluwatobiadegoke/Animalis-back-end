const express = require("express");
const router = express.Router();

const {
  getAllPosts,
  getAllIndividualPosts,
  getPost,
  uploadPost,
  deletePost,
} = require("../controllers/posts");

const addLike = require("../controllers/like");
const addComment = require("../controllers/comment");

router.route("/").get(getAllPosts).post(uploadPost);
router.route("/:id").get(getPost).delete(deletePost);
router.get("/user/posts/:id", getAllIndividualPosts);
router.post("/like/:id", addLike);
router.post("/comment/:id", addComment);

module.exports = router;
