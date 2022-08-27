import path from "path"
import multer from "multer"

//multer config
const multerConfig = multer({
  storage: multer.diskStorage({}),
  fileFilter(req, file, next) {
    const ext = path.extname(file.originalname)
    if (ext !== ".jpg" && ext !== ".png" && ext !== ".jpeg") {
      next(new Error("Only images are allowed"), false)
      return
    }
    next(null, true)
  },
})
export default multerConfig
