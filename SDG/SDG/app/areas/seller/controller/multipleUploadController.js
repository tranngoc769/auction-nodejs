/**
 * Created by trungquandev.com's author on 17/08/2019.
 * multipleUploadController.js
 */
const multipleUploadMiddleware = require("../../../middleware/multipleUploadMiddleware");

let debug = console.log.bind(console);

let multipleUpload = async (req, res) => {
  try {
    // thực hiện upload
    await multipleUploadMiddleware(req, res);
    // Upload success ==> req.files
    debug(req.files);
    console.log(req.files.length);

    if (req.files.length <= 0) {
      return res.render('account/seller/upLoadSuccess')
      {
        body : "You must upload at least 1 picture"
      };
    }
    return res.render('account/seller/upLoadSuccess')
    {
      body : "Upload Success full"
    };
  } catch (error) {
    debug(error);
    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.send(`Exceeds the number of files allowed to upload.`);
    }

    return res.send(`Error when trying upload many files: ${error}}`);
  }
};

module.exports = {
  multipleUpload: multipleUpload
};
