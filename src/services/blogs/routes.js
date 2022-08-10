import express from "express"
import blogsHandler from "./controllers.js"
import commentsHandler from "./commentsControlller.js"

const { getAllBlogs, createNewBlog, deleteBlog, getSingleBlog, editBlog } =
  blogsHandler
const {
  postComment,
  getAllComments,
  editComment,
  getSingleComment,
  deleteComment,
} = commentsHandler

const router = express.Router()

router.route("/").get(getAllBlogs).post(createNewBlog)
router.route("/:id").get(getSingleBlog).put(editBlog).delete(deleteBlog)

// COMMENT ROUTES
router.route("/:id").post(postComment)
router.route("/:id/comments").get(getAllComments)
router
  .route("/:id/comments/:commentId")
  .delete(deleteComment)
  .get(getSingleComment)
  .put(editComment)

export default router
