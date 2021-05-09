const multer = require('multer');
const uploadMiddleware = multer({
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg)$/)) {
      return cb(new Error('Not jpg or jpeg'))
    }

    cb(undefined, true)
  }
})

module.exports = uploadMiddleware




