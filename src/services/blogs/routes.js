import express from "express"
import blogsHandler from "./controllers.js"

const { getAllBlogs, createNewBlog, deleteBlog, getSingleBlog, editBlog } =
  blogsHandler

const router = express.Router()

router.route("/").get(getAllBlogs).post(createNewBlog)
router.route("/:id").get(getSingleBlog).put(editBlog).delete(deleteBlog)

export default router
