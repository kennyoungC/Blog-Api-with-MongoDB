import express from "express"
import { adminAuthMiddleware } from "../../auth/adminAuth.js"
import { basicAuthMiddleware } from "../../auth/basicAuth.js"
import { JWTAuthMiddleware } from "../../auth/tokenAuth.js"
import upload from "../../utils/multer.js"

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
  login,
  refreshToken,
} = authorsHandler

authorRouter
  .route("/me")

  .get(JWTAuthMiddleware, getPersonalAuthors)
  .put(JWTAuthMiddleware, editPersonalAuthor)
  .delete(JWTAuthMiddleware, deletePersonalAuthor)

authorRouter.post("/login", login)
authorRouter.post("/refreshToken", refreshToken)
authorRouter.post("/register", upload.single("avatar"), createNewAuthor)

authorRouter
  .route("/")
  .get(JWTAuthMiddleware, adminAuthMiddleware, getAllAuthors)
authorRouter
  .route("/:id")
  .put(JWTAuthMiddleware, adminAuthMiddleware, editAuthor)
  .delete(JWTAuthMiddleware, adminAuthMiddleware, deleteAuthor)
  .get(JWTAuthMiddleware, adminAuthMiddleware, getSingleAuthor)

export default authorRouter
