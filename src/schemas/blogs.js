import mongoose from "mongoose"

const { Schema } = mongoose

const blogsSchema = new Schema(
  {
    category: { type: String, required: true },
    title: { type: String, required: true },
    cover: { type: String, required: true },
    readTime: Schema.Types.Mixed,
    author: Schema.Types.Mixed,
    content: { type: String, required: true },
  },
  {
    timestamps: true,
  }
)
export default blogsSchema
