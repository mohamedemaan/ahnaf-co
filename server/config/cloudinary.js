const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dhsj4fdog",
  api_key: "241235445548176",
  api_secret: "fNCrarZxqvEPCJkEOfCJqRyXKAw",
});

module.exports = cloudinary;