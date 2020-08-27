const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + '-' + file.originalname);
    }
})

// Validation

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'video/mp4') {
        cb(null, true)
    } else {
        cb({message:'unsupported file format'},false)
    }
}

const upload = multer({
    storage: storage,
    limits: {fileSize:31457280},
    fileFilter: fileFilter
})

module.exports = upload;