const express = require('express');
const router = express.Router();
const multipleUploadMiddleware = require("../../../middleware/multipleUploadMiddleware");

const auth = require('../../../utils/auth');
const mPro = require('../../../models/product');
const mCat = require('../../../models/category');
const mRe = require('../../../models/review');
var moment = require('moment');

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
        await multipleUploadMiddleware(req, res);
        if (req.files.length < 3) {
            res.render('seller/Success', {
                body: '<b> Quang</b>'
            });
        } else {
            const data = JSON.parse(JSON.stringify(req.body));
            console.log(data);
            const token = req.cookies.jwt;
            const payload = await auth.verifyToken(token);
            var uID = payload.uID;
            const temp = await mCat.getCatIDbyname(data.Cate);
            var catId = temp[0].ID;
            var isExtension = 1;
            var time = moment();
            time = moment().format("DD-MM-YYYY HH:mm:ss ");
            var section = `<hr /><p><strong><img alt="" src="http://vesinhvinas.com/edit.png" style="height:16px; width:16px" /><img alt="" src="assets/images/edit.png" />${time}</strong></p>`
            var note = `'${section} ${data.editor1}'`;
            if (data.isExt == 'Yes') {
                isExtension = 1;
            }
            try {
                var arrayImg = fs.readFileSync('listImage.txt').toString().split("\n");
                fs.unlinkSync('listImage.txt');
                const ps = await mPro.addProDuct(`'${data.pName}'`, data.startPrice, catId, data.sellnowPrice, data.stepPrice, 0, `'${data.pubTime}'`, `'${data.endTime}'`, note, uID, isExtension, `'${arrayImg[0]}'`, data.startPrice);
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
router.post('/reviewPost', async(req, res) => {
    try {
        const data = JSON.parse(JSON.stringify(req.body));
        var point = data.star;
        var rev = data.review;
        var bidderID = data.ID;
        const token = req.cookies.jwt;
        const payload = await auth.verifyToken(token);
        var uID = payload.uID;
        console.log(data);
        var start = 0;
        if (point =='+1')
        {
            star = 1;
        }
        const sql = await mRe.reviewBidder(bidderID,uID,star,`'${rev}'`);

        res.render('seller/Success', {
            body: `Review thành công`
        });
    } catch (error) {
        res.render('seller/Success', {
            body: '<b> Quang</b>' + error
        });
    }
});
router.post('/cancelSell', async(req, res) => {
    try {
        const data = JSON.parse(JSON.stringify(req.body));
        var bidderID = data.ID;
        const token = req.cookies.jwt;
        var rev = 'Không thanh toán';
        const payload = await auth.verifyToken(token);
        var uID = payload.uID;
        const sql = await mRe.reviewBidder(bidderID,uID,0,`'${rev}'`);
        res.render('seller/Success', {
            body: `Hủy giao dịch thành công`
        });
    } catch (error) {
        res.render('seller/Success', {
            body: '<b> Quang</b>' + error
        });
    }
});

router.post('/editPost', async(req, res) => {
    try {
        const data = JSON.parse(JSON.stringify(req.body));

        var proID = data.ID;
        var oldNote = data.editable;
        var newNote = data.editor1;
        var time = moment();
        time = moment().format("DD-MM-YYYY HH:mm:ss ");
        var section = `<hr/><p><strong><img alt="" src="http://vesinhvinas.com/edit.png" style="height:16px; width:16px" /><img alt="" src="assets/images/edit.png" />${time}</strong></p>`
        var newDes = oldNote + section + newNote;

        const sql = await mPro.updateProduct(proID, newDes);

        res.render('seller/Success', {
            body: `Edit thành công`
        });
    } catch (error) {
        res.render('seller/Success', {
            body: '<b> Quang</b>' + error
        });
    }
});
router.get('/myproduct', async(req, res) => {
    var curTime = new Date().toJSON();
    var rows = await mPro.getRemainProduct(curTime);
    rows.forEach(element => {
        element.pubDate = moment().format("HH:mm:ss DD-MM-YYYY");
        element.endDate = moment().format("HH:mm:ss DD-MM-YYYY");
    });
    var sold = await mPro.getSoldProduct();
    sold.forEach(element => {
        element.pubDate = moment().format("HH:mm:ss DD-MM-YYYY");
        element.endDate = moment().format("HH:mm:ss DD-MM-YYYY");
    });
    console.log(sold);
    res.render("seller/myproduct", {
        products: rows,
        soldProducts : sold
    });
    //   return app.use("/", router);
});
router.get('/myproduct/:id', async(req, res) => {
    const proID = parseInt(req.params.id);
    const detail = await mPro.getOnebyId(proID);
    detail[0].pubDate = moment().format("HH:mm:ss DD-MM-YYYY");
    detail[0].endDate = moment().format("HH:mm:ss DD-MM-YYYY");
    const catname = await mCat.getCatNamebyID(detail[0].catId);
    // Co ID san pham
    res.render("seller/edit", {
        pro: detail[0],
        cat: catname[0]
    });
    //   return app.use("/", router);
});
router.get('/bidder/:id', async(req, res) => {
    const bidderID = parseInt(req.params.id);
    // const proID = parseInt(req.params.id);
    // const detail = await mPro.getOnebyId(proID);
    // detail[0].pubDate = moment().format("HH:mm:ss DD-MM-YYYY");
    // detail[0].endDate = moment().format("HH:mm:ss DD-MM-YYYY");
    // const catname = await mCat.getCatNamebyID(detail[0].catId);
    // Co ID san pham
    res.render("seller/biddereview",
    {
        ID: bidderID
    });
    //   return app.use("/", router);
});
router.get('/detail/:id', async(req, res) => {
    const proID = parseInt(req.params.id);
    // const proID = parseInt(req.params.id);
    // const detail = await mPro.getOnebyId(proID);
    // detail[0].pubDate = moment().format("HH:mm:ss DD-MM-YYYY");
    // detail[0].endDate = moment().format("HH:mm:ss DD-MM-YYYY");
    // const catname = await mCat.getCatNamebyID(detail[0].catId);
    // Co ID san pham
    res.render("seller/biddereview",
    {
        ID: bidderID
    });
    //   return app.use("/", router);
});
module.exports = router;