import createHttpError from "http-errors"
import authorsModel from "../../models/authors.js"

const getAllAuthors = async (req, res, next) => {
  try {
    const authors = await authorsModel.find()
  } catch (error) {
    next(createHttpError(500, error.message))
  }
}
const authorsHandler = {
  getAllAuthors,
}
