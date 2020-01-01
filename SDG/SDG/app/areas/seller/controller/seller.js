const express = require('express');
const router = express.Router(); 
const multipleUploadMiddleware = require("../../../middleware/multipleUploadMiddleware");
//If the data was sent as JSON
var app = express();
exphbs = require('express-handlebars');
router.use(express.json());
const multipleUploadController = require("./multipleUploadController");
//If the data was sent using Content-Type: application/x-www-form-urlencoded
router.use(express.urlencoded({ extended: false }));

const hbs = exphbs.create({
  extname      :'hbs',
  layoutsDir   : '../../../views/seller/',
  defaultLayout: 'default',
  partialsDir  : [
      '../../../views/seller/partials'
  ]
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
//
router.get('/', async (req, res) => {
    res.render("seller/homepage");
  // Upload nhiều file với phương thức post

//   return app.use("/", router);
});
router.post('/multiple-upload', async (req, res) => {
  try {
    // thực hiện upload
    await multipleUploadMiddleware(req, res);
    // Upload success ==> req.files
    
    if (req.files.length <= 0) {
      res.render('seller/Success', {
        body: 'You must upload at least 1 picture'
    });
    }
    else
    {
    res.render('seller/Success', {
      body: 'Add product successful'
  });

    }
  } catch (error) {
    debug(error);
    res.render('seller/Success', {
      body: 'Add product failed'
  });
  }
});
module.exports = router;