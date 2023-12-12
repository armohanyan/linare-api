const Multer = require("multer");

const imageFilter = (req, file, cb) => {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
        cb(null, true);
    } else {
        cb(null, false);
        return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
};

const uploadFile = Multer({
    storage: Multer.memoryStorage(),
    fileFilter: imageFilter
})

module.exports = uploadFile;