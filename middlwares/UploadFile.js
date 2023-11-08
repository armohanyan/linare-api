const Multer = require("multer");

const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb("Please upload only images.", false);
    }
};

const uploadFile = Multer({
    storage: Multer.memoryStorage(),
    limits: {
        fileSize: process.env.MULTER_LIMIT_SIZE
    },
    fileFilter: imageFilter
})

module.exports = uploadFile;