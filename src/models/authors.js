import mongoose from "mongoose"
import authorsSchema from "../schemas/authors.js"

const authorsModel = mongoose.model("Blog", authorsSchema)

export default authorsModel
