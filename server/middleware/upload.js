const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "products",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "mp4", "mov"],
    resource_type: "auto",
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    console.log("MULTER FILE FILTER HIT:", file.fieldname);
    cb(null, true);
  }
});

module.exports = upload;