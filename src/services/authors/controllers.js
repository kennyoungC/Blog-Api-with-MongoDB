import createHttpError from "http-errors"
import authorsModel from "../../models/authors.js"
import {
  authenticateAuthor,
  verifyRefreshTokenAndGenerateNewTokens,
} from "../../auth/tools.js"
import cloudinary from "../../utils/cloudinary.js"

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
    const result = await cloudinary.uploader.upload(req.file.path)
    const newAuthor = new authorsModel({
      ...req.body,
      avatar: result.secure_url,
      cloudinaryId: result.public_id,
    })
    const data = await newAuthor.save()

    res.status(201).send(data)
  } catch (error) {
    next(createHttpError(500, error.message))
  }
}
const editAuthor = async (req, res, next) => {
  try {
    const author = await authorsModel.findById(req.params.id)
    if (author) {
      let result
      if (req.file) {
        await cloudinary.uploader.destroy(author.cloudinaryId)
        result = await cloudinary.uploader.upload(req.file.path)
      }
      const modifiedAuthor = {
        ...author.toObject(),
        avatar: result ? result.secure_url : author.avatar,
        cloudinaryId: result ? result.public_id : author.cloudinaryId,
        ...req.body,
      }
      const updatedAuthor = await authorsModel.findByIdAndUpdate(
        req.params.id,
        modifiedAuthor,
        { new: true, runValidators: true }
      )

      res.send(updatedAuthor)
    } else {
      next(createHttpError(404, "Author not found"))
    }
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
    const author = await authorsModel.findById(req.params.id)
    if (author) {
      await cloudinary.uploader.destroy(author.cloudinaryId)
      await authorsModel.findByIdAndDelete(req.param.id)
      res.status(204).send()
    } else {
      next(createHttpError(404, "Author not found"))
    }
  } catch (error) {
    next(createHttpError(500, error.message))
  }
}

const getPersonalAuthors = async (req, res, next) => {
  try {
    res.send(req.user)
  } catch (error) {
    next(createHttpError(500, error.message))
  }
}
const editPersonalAuthor = async (req, res, next) => {
  try {
    const modifiedAuthor = await authorsModel.findByIdAndUpdate(
      req.user._id,
      req.body,
      { new: true, runValidators: true }
    )
    if (modifiedAuthor) {
      res.send(modifiedAuthor)
    } else {
      next(createHttpError(404, "Author not found"))
    }
  } catch (error) {
    next(createHttpError(500, error.message))
  }
}
const deletePersonalAuthor = async (req, res, next) => {
  try {
    await authorsModel.findByIdAndDelete(req.user._id)
    res.status(204).send()
  } catch (error) {
    next(createHttpError(500, error.message))
  }
}
const login = async (req, res, next) => {
  try {
    const author = await authorsModel.checkCredentials(
      req.body.email,
      req.body.password
    )
    if (author) {
      const { accessToken, refreshToken } = await authenticateAuthor(author)

      res.send({ accessToken, refreshToken })
    } else {
      next(createHttpError(401, "Invalid credentials"))
    }
  } catch (error) {
    next(createHttpError(500, error.message))
  }
}
const refreshToken = async (req, res, next) => {
  try {
    // 1. Obtain refreshToken from req.body
    const { currentRefreshToken } = req.body
    // 2. Check the validity of that token (check if it is not expired, check if it hasn'been compromised, check if it is the same as the one we have in db)
    // 3. If everything is fine --> generate a new pair of tokens (accessToken2 & refreshToken2)
    const { accessToken, refreshToken } =
      await verifyRefreshTokenAndGenerateNewTokens(currentRefreshToken)
    //4. send them back as response
    res.send({ accessToken, refreshToken })
  } catch (error) {
    next(createHttpError(500, error.message))
  }
}

const authorsHandler = {
  getAllAuthors,
  createNewAuthor,
  deleteAuthor,
  getSingleAuthor,
  editAuthor,
  getPersonalAuthors,
  editPersonalAuthor,
  deletePersonalAuthor,
  login,
  refreshToken,
}

export default authorsHandler
