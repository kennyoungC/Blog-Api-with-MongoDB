import createHttpError from "http-errors"

const adminAuthMiddleware = (req, res, next) => {
  if (req.user.role === "Admin") {
    next()
  } else {
    next(createHttpError(403, "You are not authorized to access this page"))
  }
}
export { adminAuthMiddleware }
