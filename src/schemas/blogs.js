import mongoose from "mongoose"
import commentsSchema from "./comments.js"

const { Schema } = mongoose

const blogsSchema = new Schema(
  {
    category: { type: String, required: true },
    title: { type: String, required: true },
    cover: { type: String, required: true },
    readTime: {
      value: { type: Number, required: true },
      unit: { type: String, required: true },
    },
    author: {
      name: { type: String, required: true },
      avatar: { type: String, required: true },
    },
    content: { type: String, required: true },
    comments: { default: [], type: [commentsSchema] },
  },
  {
    timestamps: true,
  }
)
export default blogsSchema
