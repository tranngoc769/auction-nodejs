const express = require('express');
const router = express.Router(); 
const multipleUploadMiddleware = require("../../../middleware/multipleUploadMiddleware");

const auth = require('../../../utils/auth');
const mPro = require('../../../models/product');
const mCat = require('../../../models/category');
//If the data was sent as JSON
var app = express();
exphbs = require('express-handlebars');
router.use(express.json());
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
  const listParDM = await mCat.getParentCategory();
 const data = JSON.parse(JSON.stringify(listParDM));
  var matrix = [];
  for(var i=0; i<data.length; i++) {
    const listCDM = await mCat.getChildCategory(data[i].ID);
    const data2 = JSON.parse(JSON.stringify(listCDM));
    matrix.push(data2);

  }
  res.render("seller/homepage",
  {
    Cha : listParDM,
    Matrix : matrix
  });
//   return app.use("/", router);
});
router.post('/multiple-upload', async (req, res) => {
  try {
    // thực hiện upload
    await multipleUploadMiddleware(req, res);
    // Upload success ==> req.files
    
    if (req.files.length <= -6) {
      res.render('seller/Success', {
        body: 'You must upload at least 1 picture'
    });
    }
    else
    {
      
    const data = JSON.parse(JSON.stringify(req.body));
    console.log(stdout,data);
    const token = req.cookies.jwt;
    const payload = await auth.verifyToken(token);
     var uID =  payload.uID ;
    const catId = await mCat.getCatIDbyname(data.Cate);
    
    const ps = await mPro.addProDuct(data.pName, curPrice, catId, sellNowPrice, stepPrice, HighestBidderID, countBidder, pubDate, endDate, ImagePro, Describle, sellerID, isExtension);
    
    res.render('seller/Success', {
      body: 'Add product successful'
  });

    }
  } catch (error) {
    
    res.render('seller/Success', {
      body: 'Add product failed'
  });
  }
});
module.exports = router;