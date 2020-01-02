const express = require('express');
const router = express.Router();
const multipleUploadMiddleware = require("../../../middleware/multipleUploadMiddleware");

const auth = require('../../../utils/auth');
const mPro = require('../../../models/product');
const mCat = require('../../../models/category');


var fs = require('fs');
//If the data was sent as JSON
var app = express();
exphbs = require('express-handlebars');
router.use(express.json());
//If the data was sent using Content-Type: application/x-www-form-urlencoded
router.use(express.urlencoded({ extended: false }));

const hbs = exphbs.create({
    extname: 'hbs',
    layoutsDir: '../../../views/seller/',
    defaultLayout: 'default',
    partialsDir: [
        '../../../views/seller/partials'
    ]
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
//
router.get('/', async(req, res) => {
    const listParDM = await mCat.getParentCategory();
    const data = JSON.parse(JSON.stringify(listParDM));
    var matrix = [];
    for (var i = 0; i < data.length; i++) {
        const listCDM = await mCat.getChildCategory(data[i].ID);
        const data2 = JSON.parse(JSON.stringify(listCDM));
        matrix.push(data2);

    }


    res.render("seller/homepage", {
        Cha: listParDM,
        Matrix: matrix
    });
    //   return app.use("/", router);
});
router.post('/multiple-upload', async(req, res) => {
    try {
        // thực hiện upload
        await multipleUploadMiddleware(req, res);
        // Upload success ==> req.files

        if (req.files.length < 3) {
            res.render('seller/Success', {
                body: 'You must upload at least 3 picture'
            });
        } else {
            const data = JSON.parse(JSON.stringify(req.body));
            const token = req.cookies.jwt;
            const payload = await auth.verifyToken(token);
            var uID = payload.uID;
            const temp = await mCat.getCatIDbyname(data.Cate);
            var catId = temp[0].ID;
            var isExtension = 1;
            var note = `'${data.editor1}'`;
            if (data.isExt == 'Yes') {
                isExtension = 0;
            }

            try {
                var arrayImg = fs.readFileSync('listImage.txt').toString().split("\n");
                fs.unlinkSync('listImage.txt');
                const ps = await mPro.addProDuct('${data.pName}', data.startPrice, catId, data.sellnowPrice, data.stepPrice, 0, `'${data.pubTime}','${data.endTime}', note, uID, isExtension,'${arrayImg[0]}'`, data.startPrice);
                var row = await mPro.getProIDbyImg(arrayImg[0]);
                var proID = row[0].ID;
                //1--> n nhung hien thi n+1
                for (var i = 1; i < arrayImg.length - 1; i++) {
                    await mPro.addProSubImg(proID, `'${arrayImg[i]}'`)
                }

                res.render('seller/Success', {
                    body: `Thành Công Đã thêm sản phẩm vào danh sách đấu giá`
                });
            } catch (error) {
                res.render('seller/Success', {
                    body: 'Add product failed' + error
                });
            }

        }
    } catch (error) {
        res.render('seller/Success', {
            body: 'Add product failed' + error
        });
    }
});


router.get('/myproduct', async(req, res) => {
    var curTime = new Date().toJSON();
    const rows = mPro.getRemainProduct(curTime);
    console.log(rows);
    res.render("seller/myproduct", {
        products: rows
    });
    //   return app.use("/", router);
});
module.exports = router;