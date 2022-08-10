import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import listEndpoints from "express-list-endpoints"
import blogRoutes from "./services/blogs/routes.js"
import authorRouter from "./services/authors/routes.js"
const server = express()

const port = process.env.PORT || 3001
server.use(express.json())
server.use(cors())

server.use("/api/blogPosts", blogRoutes)
server.use("/api/authors", authorRouter)

mongoose.connect(process.env.MONGODB_URI)

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB")

  server.listen(port, () => {
    console.table(listEndpoints(server))

    console.log(`Server listening on port ${port}`)
  })
})

mongoose.connection.on("error", (err) => {
  console.log(err)
})
