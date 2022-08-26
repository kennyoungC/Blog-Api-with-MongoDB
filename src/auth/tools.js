import createHttpError from "http-errors"
import jwt from "jsonwebtoken"
import authorsModel from "../models/authors.js"

export const authenticateAuthor = async (author) => {
  // 1. Given the author, it generates two tokens (accessToken & refreshToken)
  const accessToken = await generateAccssToken({
    _id: author._id,
    role: author.role,
  })
  const refreshToken = await generateRefreshToken({
    _id: author._id,
    role: author.role,
  })

  // 2. RefreshToken should be saved in the DB
  author.refreshToken = refreshToken
  await author.save()

  //3. Return the two Tokens
  return { accessToken, refreshToken }
}

export const verifyRefreshTokenAndGenerateNewTokens = async (
  currentRefreshToken
) => {
  try {
    // 1. Check expiration date and integrity of the refresh token, we gonna catch potential errors
    const { _id } = await verifyRefreshToken(currentRefreshToken)
    // 2. If the token is valid, we shall check if it matches to the one we have in db
    const author = await authorsModel.findById(_id)
    if (!author) throw createHttpError(404, `Author with id ${_id} not found!`)

    if (author.refreshToken && author.refreshToken === currentRefreshToken) {
      // 3. If everything is fine --> generate new tokens and return them
      const { accessToken, refreshToken } = await authenticateAuthor(author)
      return { accessToken, refreshToken }
    } else {
      throw createHttpError(401, "Refresh token not Valid!")
    }
  } catch (error) {
    // 4. In case of troubles --> catch the error and send 401
    throw createHttpError(401, "Refresh token not valid!")
  }
}

export const generateAccssToken = (payload) =>
  new Promise((res, rej) => {
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "15 min" },
      (err, token) => {
        if (err) rej(err)
        else res(token)
      }
    )
  })

export const verifyAccessToken = (token) => {
  return new Promise((res, rej) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) rej(err)
      else res(payload)
    })
  })
}

export const generateRefreshToken = (payload) => {
  return new Promise((res, rej) => {
    jwt.sign(
      payload,
      process.env.JWT_REFRESH_TOKEN,
      { expiresIn: "1 week" },
      (err, token) => {
        if (err) rej(err)
        else res(token)
      }
    )
  })
}
export const verifyRefreshToken = (token) => {
  return new Promise((res, rej) => {
    jwt.verify(token, process.env.JWT_REFRESH_TOKEN, (err, payload) => {
      if (err) rej(err)
      else res(payload)
    })
  })
}
