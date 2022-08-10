import express from "express"
import router from "../blogs/routes.js"

const authorRouter = express.Router()
import authorsHandler from "./controllers.js"

const { getAllAuthors, createNewAuthor, deleteAuthor, getSingleAuthor } =
  authorsHandler

authorRouter.route("/").get(getAllAuthors).post(createNewAuthor)
authorRouter.route("/:id").delete(deleteAuthor).get(getSingleAuthor)

export default authorRouter
