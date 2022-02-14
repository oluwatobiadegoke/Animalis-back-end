const express = require("express");
const router = express.Router();

const {
  getAllPosts,
  getAllIndividualPosts,
  getPost,
  uploadPost,
  deletePost,
} = require("../controllers/posts");

const { addLike, removeLike } = require("../controllers/like");
const { addComment, removeComment } = require("../controllers/comment");

router.route("/").get(getAllPosts).post(uploadPost);
router.route("/:id").get(getPost).delete(deletePost);
router.get("/user/posts/:id", getAllIndividualPosts);
router.post("/like", addLike);
router.post("/unlike", removeLike);
router.route("/comment").post(addComment);
router.route("/comment/:postId").patch(removeComment);

module.exports = router;
