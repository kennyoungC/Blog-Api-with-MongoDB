import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import listEndpoints from "express-list-endpoints"
import blogRoutes from "./services/blogs/routes.js"
import authorRouter from "./services/authors/routes.js"
import {forbiddenHandler, unauthorizedHandler, catchAllHandler} from "./errorHandlers.js"

const server = express()

const port = process.env.PORT || 3001
server.use(express.json())
server.use(cors())


// **************** ENDPOINTS ***************
server.use("/api/blogPosts", blogRoutes)
server.use("/api/authors", authorRouter)




//************* ERROR HANDLERS *************
server.use(unauthorizedHandler)
server.use(forbiddenHandler)
server.use(catchAllHandler)


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
