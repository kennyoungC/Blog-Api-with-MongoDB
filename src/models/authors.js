import mongoose from "mongoose"
import authorsSchema from "../schemas/authors.js"

const authorsModel = mongoose.model("Authors", authorsSchema)

export default authorsModel
