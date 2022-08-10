import mongoose from "mongoose"

const { Schema } = mongoose

const commentsSchema = new Schema(
  {
    text: { type: String, required: true },
    userName: { type: String, required: true },
  },
  {
    timestamps: true,
  }
)

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
