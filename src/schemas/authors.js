import mongoose from "mongoose"
const { Schema } = mongoose

const authorsSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    blogPosts: { default: [], type: [Schema.Types.ObjectId] },
  },
  {
    timestamps: true,
  }
)
export default authorsSchema