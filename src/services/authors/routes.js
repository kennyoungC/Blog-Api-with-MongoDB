import express from "express"
import { adminAuthMiddleware } from "../../auth/adminAuth.js"
import { basicAuthMiddleware } from "../../auth/basicAuth.js"

const authorRouter = express.Router()
import authorsHandler from "./controllers.js"

const {
  getAllAuthors,
  createNewAuthor,
  deleteAuthor,
  getSingleAuthor,
  editAuthor,
  deletePersonalAuthor,
  editPersonalAuthor,
  getPersonalAuthors,
} = authorsHandler

authorRouter
  .route("/me")
  .get(basicAuthMiddleware, getPersonalAuthors)
  .put(basicAuthMiddleware, editPersonalAuthor)
  .delete(basicAuthMiddleware, deletePersonalAuthor)

authorRouter
  .route("/")
  .post(createNewAuthor)
  .get(basicAuthMiddleware, adminAuthMiddleware, getAllAuthors)
authorRouter
  .route("/:id")
  .put(basicAuthMiddleware, adminAuthMiddleware, editAuthor)
  .delete(basicAuthMiddleware, adminAuthMiddleware, deleteAuthor)
  .get(basicAuthMiddleware, adminAuthMiddleware, getSingleAuthor)

export default authorRouter
