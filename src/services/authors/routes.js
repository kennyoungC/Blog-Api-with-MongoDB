import express from "express"

const authorRouter = express.Router()

authorRouter.route("/").get()

export default authorRouter
