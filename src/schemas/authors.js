import mongoose from "mongoose"
const { Schema } = mongoose

const authorsSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    avatar: { type: String, required: true },
    password: {type: String, required: true},
    role: {type: String, enum: ["User", "Admin"], default: "User"}
  },
  {
    timestamps: true,
  }
)



export default authorsSchema
