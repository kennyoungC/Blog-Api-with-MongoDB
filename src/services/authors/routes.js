import express from "express"
import passport from "passport"
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

authorRouter.get(
  "/googleLogin",
  passport.authenticate("google", { scope: ["profile", "email"] })
)
authorRouter.get(
  "/googleRedirect",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.API_URL}/api/authors/login`,
  }),
  (req, res, next) => {
    // The purpose of this endpoint is to receive a response from Google, execute the google callback function, then send a response to the client
    try {
      const { accessToken, refreshToken } = req.user
      res.redirect(
        `${process.env.FE_URL}?accessToken=${accessToken}&refreshToken=${refreshToken}`
      )
    } catch (error) {
      next(error)
    }
  }
)

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
