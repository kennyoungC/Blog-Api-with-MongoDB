import mongoose from "mongoose"
import bcrypt from "bcrypt"
const { Schema } = mongoose

const authorsSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    avatar: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["User", "Admin"], default: "User" },
  },
  {
    timestamps: true,
  }
)

authorsSchema.pre("save", async function (next) {
  const currentUser = this
  const plainPassword = currentUser.password
  if (currentUser.isModified("password")) {
    const hashedPassword = await bcrypt.hash(plainPassword, 11)
    currentUser.password = hashedPassword
  }
  next()
})

authorsSchema.methods.toJSON = function () {
  const userObject = this.toObject()

  delete userObject.password
  delete userObject.__v

  return userObject
}

authorsSchema.static("checkCredentials", async function (email, password) {
  const user = await this.findOne({ email })
  if (!user) {
    return null
  }
  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    return null
  }
  return user
})

export default authorsSchema
