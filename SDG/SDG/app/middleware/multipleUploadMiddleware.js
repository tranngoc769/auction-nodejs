/**
 * Created by trungquandev.com's author on 17/08/2019.
 * multipleUploadMiddleware.js
 */
const util = require("util");
const path = require("path");
const multer = require("multer");
let storage = multer.diskStorage({
  // where to save
  destination: (req, file, callback) => {
    callback(null, path.join(`${__dirname}/../../public/assets/photos`));
  },
  filename: (req, file, callback) => {
    let math = ["image/png", "image/jpeg"];
    if (math.indexOf(file.mimetype) === -1) {
      let errorMess = `The file <strong>${file.originalname}</strong> is invalid. Only allowed to upload image jpeg or png.`;
      return callback(errorMess, null);
    }
    let filename = `${Date.now()}-tranngoc-${file.originalname}`;
    callback(null, filename);
  }
});

let uploadManyFiles = multer({storage: storage}).array("many-files", 17);
let multipleUploadMiddleware = util.promisify(uploadManyFiles);
module.exports = multipleUploadMiddleware;
