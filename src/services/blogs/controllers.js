import createHttpError from "http-errors"
import blogsModel from "../../models/Blogs.js"
import q2m from "query-to-mongo"

const getAllBlogs = async (req, res, next) => {
  try {
    const mongoQuery = q2m(req.query)
    const blogs = await blogsModel
      .find(mongoQuery.criteria, mongoQuery.options.fields)
      .skip(mongoQuery.options.skip)
      .limit(mongoQuery.options.limit)
      .sort(mongoQuery.options.sort)
      .populate({ path: "author", select: "name email avatar" })
    res.send(blogs)
  } catch (error) {
    next(createHttpError(500, error.message))
  }
}

const createNewBlog = async (req, res, next) => {
  try {
    const newBlog = new blogsModel(req.body)
    const data = await newBlog.save()

    res.send(data)
  } catch (error) {
    next(createHttpError(500, error.message))
  }
}
const editBlog = async (req, res, next) => {
  try {
    //findByIdAndUpdate is a mongoose method that updates a document in the database(it receives an id and an object and the third parameter returns the updated document)
    const blog = await blogsModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
    res.send(blog)
  } catch (error) {
    next(createHttpError(500, error.message))
  }
}
const getSingleBlog = async (req, res, next) => {
  try {
    const blog = await blogsModel.findById(req.params.id)
    res.send(blog)
  } catch (error) {
    next(createHttpError(500, error.message))
  }
}
const deleteBlog = async (req, res, next) => {
  try {
    const blog = await blogsModel.findByIdAndDelete(req.params.id)
    res.send(blog)
  } catch (error) {
    next(createHttpError(500, error.message))
  }
}
const getAuthorsBlog = async (req, res, next) => {
  try {
    const blog = await blogsModel.find({ author: req.user._id })
    res.send(blog)
  } catch (error) {
    next(createHttpError(500, error.message))
  }
}
const editShareBlog = async (req, res, next) => {
  try {
    const blog = await blogsModel.findById(req.params.id)

    if (blog.author.includes(req.user._id)) {
      const modifiedBlog = await blogsModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      )
      res.send(modifiedBlog)
    } else {
      next(createHttpError(403, "You can't edit this blog"))
    }
  } catch (error) {
    next(createHttpError(500, error.message))
  }
}

const deleteShareBlog = async (req, res, next) => {
  try {
    const blog = await blogsModel.findById(req.params.id)
    if (blog.author.includes(req.user._id)) {
      await blogsModel.findByIdAndDelete(req.params.id)
      res.status(204).send()
    } else {
      next(createHttpError(403, "You can't delete this blog"))
    }
  } catch (error) {
    next(createHttpError(500, error.message))
  }
}

const blogsHandler = {
  getAllBlogs,
  createNewBlog,
  editBlog,
  getSingleBlog,
  deleteBlog,
  getAuthorsBlog,
  editShareBlog,
  deleteShareBlog,
}
export default blogsHandler
