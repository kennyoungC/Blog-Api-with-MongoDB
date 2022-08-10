import mongoose from "mongoose"
import authorsSchema from "../schemas/authors.js"

const authorsModel = mongoose.model("Author", authorsSchema)

export default authorsModel
