import createHttpError from "http-errors"
import blogsModel from "../../models/Blogs.js"

const postComment = async (req, res, next) => {
  try {
    const blog = await blogsModel.findById(req.params.id)
    if (blog) {
      const newComment = {
        ...req.body,
      }
      const updatedBlog = await blogsModel.findByIdAndUpdate(
        req.params.id,
        { $push: { comments: newComment } },
        { new: true, runValidators: true }
      )
      if (updatedBlog) {
        res.send(updatedBlog)
      } else {
        next(createHttpError(500, "Something went wrong"))
      }
    } else {
      next(createHttpError(404, "Blog not found"))
    }
  } catch (error) {
    next(createHttpError(500, error.message))
  }
}

const getSingleComment = async (req, res, next) => {
  try {
    const blog = await blogsModel.findById(req.params.id)
    if (blog) {
      const comment = blog.comments.find(
        (comment) => comment._id.toString() === req.params.commentId
      )
      if (comment) {
        res.send(comment)
      } else {
        next(createHttpError(404, "Comment not found"))
      }
    }
  } catch (error) {
    next(createHttpError(500, error.message))
  }
}

const editComment = async (req, res, next) => {
  try {
    const blog = await blogsModel.findById(req.params.id)
    if (blog) {
      const index = blog.comments.findIndex(
        (blog) => blog._id.toString() === req.params.commentId
      )
      const foundComment = blog.comments[index].toObject()
      console.log(foundComment)
      if (index !== -1) {
        blog.comments[index] = {
          ...foundComment,
          ...req.body,
        }
        await blog.save()
        res.send(blog.comments[index])
      } else {
        next(createHttpError(404, "Comment not found"))
      }
    } else {
      next(createHttpError(404, "Blog not found"))
    }
  } catch (error) {
    next(createHttpError(500, error.message))
  }
}

const getAllComments = async (req, res, next) => {
  try {
    const blog = await blogsModel.findById(req.params.id)
    console.log(blog)
    if (blog) {
      res.send(blog.comments)
    } else {
      next(createHttpError(404, "Blog not found"))
    }
  } catch (error) {
    next(createHttpError(500, error.message))
  }
}
const deleteComment = async (req, res, next) => {
  try {
    const blog = await blogsModel.findById(req.params.id)
    const { id, commentId } = req.params
    console.log(id, commentId)
    if (blog) {
      const updatedBlog = await blogsModel.findByIdAndUpdate(
        id, // Which blog to update
        { $pull: { comments: { _id: commentId } } }, // How to update the blog
        { new: true, runValidators: true } // Options
      )
      if (updatedBlog) {
        res.send(updatedBlog)
      } else {
        next(createHttpError(404, "blog not found"))
      }
    }
  } catch (error) {
    next(createHttpError(500, error.message))
  }
}

const commentsHandler = {
  postComment,
  getAllComments,
  deleteComment,
  getSingleComment,
  editComment,
}
export default commentsHandler
