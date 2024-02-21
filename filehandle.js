
const multer = require('multer')
const path = require('path')

// Set up storage for uploaded images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/' + req.params.userid + "/")
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`)
    }
})
const upload = multer({
    storage, fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|pdf|docx|pptx|mp3)$/)) {
            req.uploaderror = true;
            return cb(null)
        }

        cb(null, true)
    }
})

module.exports = { storage, upload, path }
