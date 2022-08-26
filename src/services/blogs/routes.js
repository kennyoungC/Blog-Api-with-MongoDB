import express from "express"
import blogsHandler from "./controllers.js"
import commentsHandler from "./commentsControlller.js"
import { basicAuthMiddleware } from "../../auth/basicAuth.js"
import { adminAuthMiddleware } from "../../auth/adminAuth.js"

const {
  getAllBlogs,
  createNewBlog,
  deleteBlog,
  getSingleBlog,
  editBlog,
  getAuthorsBlog,
  editShareBlog,
  deleteShareBlog,
} = blogsHandler
const {
  postComment,
  getAllComments,
  editComment,
  getSingleComment,
  deleteComment,
} = commentsHandler

const router = express.Router()

router.route("/stories/me").get(basicAuthMiddleware, getAuthorsBlog)

router
  .route("/stories/me/:id")
  .put(basicAuthMiddleware, editShareBlog)
  .delete(basicAuthMiddleware, deleteShareBlog)

router
  .route("/")
  .get(basicAuthMiddleware, adminAuthMiddleware, getAllBlogs)
  .post(createNewBlog)
router
  .route("/:id")
  .get(basicAuthMiddleware, adminAuthMiddleware, getSingleBlog)
  .put(basicAuthMiddleware, adminAuthMiddleware, editBlog)
  .delete(basicAuthMiddleware, adminAuthMiddleware, deleteBlog)

// COMMENT ROUTES
router.route("/:id").post(postComment)
router.route("/:id/comments").get(getAllComments)
router
  .route("/:id/comments/:commentId")
  .delete(deleteComment)
  .get(getSingleComment)
  .put(editComment)

export default router
