import GoogleStrategy from "passport-google-oauth20"
import authorsModel from "../models/authors.js"
import { authenticateAuthor } from "./tools.js"

const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.API_URL}/api/authors/googleRedirect`,
  },
  async (_, __, profile, passportNext) => {
    try {
      const author = await authorsModel.findOne({ email: profile._json.email })
      // This callback function is executed when Google sends us a successfull response back
      // Here we are receiving some informations about the user from Google (scopes --> email, profile)
      // 1. Check if the user is already in our db
      if (author) {
        // 2. If he/she is there --> generate accessToken (optionally a refreshToken)
        const { accessToken, refreshToken } = await authenticateAuthor(author)
        // 3. Then we can go next (we go to the /googleRedirect route handler)
        passportNext(null, { accessToken, refreshToken })
      } else {
        // 4. Else if the user is not in our db --> create that user and generate an accessToken (optionally a refreshToken)
        const { name, email, picture } = profile._json
        const newAuthor = new authorsModel({
          name,
          email,
          avatar: picture,
          googleId: profile.id,
        })

        const createdAuthor = await newAuthor.save()
        const { accessToken, refreshToken } = await authenticateAuthor(
          createdAuthor
        )
        // Next
        passportNext(null, { accessToken, refreshToken })
      }
    } catch (error) {
      passportNext(error)
    }
  }
)

export default googleStrategy
