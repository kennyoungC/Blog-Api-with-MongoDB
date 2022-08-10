import createHttpError from "http-errors"
import authorsModel from "../../models/authors.js"
import q2m from "query-to-mongo"

const getAllAuthors = async (req, res, next) => {
  try {
    const authors = await authorsModel.find()

    res.send(authors)
  } catch (error) {
    next(createHttpError(500, error.message))
  }
}
const createNewAuthor = async (req, res, next) => {
  try {
    const newAuthor = new authorsModel(req.body)
    const data = await newAuthor.save()

    res.send(data)
  } catch (error) {
    next(createHttpError(500, error.message))
  }
}
const getSingleAuthor = async (req, res, next) => {
  try {
    const author = await authorsModel.findById(req.params.id)
    if (author) {
      res.send(author)
    } else {
      next(createHttpError(404, "Author not found"))
    }
  } catch (error) {
    next(createHttpError(500, error.message))
  }
}
const deleteAuthor = async (req, res, next) => {
  try {
    await authorsModel.findByIdAndDelete(req.params.id)
    res.status(204).send()
  } catch (error) {
    next(createHttpError(500, error.message))
  }
}
const authorsHandler = {
  getAllAuthors,
  createNewAuthor,
  deleteAuthor,
  getSingleAuthor,
}

export default authorsHandler
