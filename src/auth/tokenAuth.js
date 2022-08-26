import createHttpError from "http-errors"
import { verifyAccessToken } from "./tools.js"

export const JWTAuthMiddleware = async (req, res, next) => {
  const { authorization } = req.headers
  if (!authorization) {
    next(
      createHttpError(
        401,
        "Please provide Bearer Token in the authorization header!"
      )
    )
  } else {
    try {
      const token = authorization.replace("Bearer ", "")

      const { _id, role } = await verifyAccessToken(token)

      req.user = {
        _id,
        role,
      }
      next()
    } catch (error) {
      next(next(createHttpError(401, "Token not valid!")))
    }
  }
}
