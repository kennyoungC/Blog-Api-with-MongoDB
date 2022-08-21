import atob from "atob"
import createHttpError from "http-errors"
import authorsModel from "../models/authors.js"

export const basicAuthMiddleware = async (req, res, next) => {
  // Here we are receiving something like --> Authorization: "Basic QmV0dHllNEBnbWFpbC5jb206MTIzNA=="
  // 1. Check if authorization header is provided, if it is not --> trigger an error (401
  const { authorization } = req.headers
  if (!authorization) {
    next(createHttpError(401, "Crendentials are not valid"))
  }
  // 2. If we have received authorization header, we should extract the credentials out of it (credentials are base64 encoded, therefore we should decode them)
  const [_, base64Credentials] = authorization.split(" ")
  const [username, password] = atob(base64Credentials).split(":")

  // 3. Once we obtain the credentials, it's time to find the user in the db by email and then compare received password with the hashed one
  const user = await authorsModel.checkCredentials(username, password)
  if (!user) {
    next(createHttpError(401, "Crendentials are not valid"))
  }
  req.user = user
  next()
}
