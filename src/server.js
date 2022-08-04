import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import listEndpoints from "express-list-endpoints"

const server = express()

const port = process.env.PORT || 3001
server.use(express.json())
server.use(cors())

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
