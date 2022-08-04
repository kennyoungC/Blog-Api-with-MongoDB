import mongoose from "mongoose"
import blogsSchema from "../schemas/blogs.js"

const blogsModel = mongoose.model("Blog", blogsSchema)

export default blogsModel
