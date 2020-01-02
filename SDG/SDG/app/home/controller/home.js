const express = require('express');
const router = express.Router();
const mUser = require('../../models/user');
const mProduct = require('../../models/product');
const mReview = require('../../models/review');
const mCat = require('../../models/category');
const auth = require('../../utils/auth');
var moment = require('moment');

//Number of good review for bidder to bid
const numberOfGoodReviewBidderRequried = 1 // 1 for testing, correct is 5
    //If the data was sent as JSON
router.use(express.json());
//If the data was sent using Content-Type: application/x-www-form-urlencoded
router.use(express.urlencoded({ extended: false }));
//

router.get('/', async(req, res) => {
    const token = req.cookies.jwt;

    //load cho sideBar
    const parentCat = await mCat.getParentCategory();

    const listParDM = await mCat.getParentCategory();
    const data = JSON.parse(JSON.stringify(listParDM));
    var matrixChildCat = [];
    for (var i = 0; i < data.length; i++) {
        const listCDM = await mCat.getChildCategory(data[i].ID);
        const data2 = JSON.parse(JSON.stringify(listCDM));
        matrixChildCat.push(data2);

    }

    var time = moment();
    time = moment().format("DD-MM-YYYY HH:mm:ss ");

    //get Top 5 sản phẩm có nhiều lượt ra giá nhất(dung allProducts)
    const productsBestBegCount = await mProduct.getProTopBestBegCount();




    //Top 5 sản phẩm gần kết thúc (sắp xếp theo thời gian kết thúc giảm dần)
    const productsTopEndDate = await mProduct.getProTopEndDate(time);

    //get Top 5 sản phẩm chưa kết thúc có giá cao nhất//get all sản phẩm(đang thay chỗ cho cái giá cao nhất)
    const productsTopHightestPrice = await mProduct.getProTopHightestPrice(time);

    if (typeof token == "string") {
        const payload = await auth.verifyToken(token);
        if (payload.roleName == "admin") {
            res.redirect(`/${payload.roleName}`);
        } else {
            const payload = await auth.verifyToken(token);

            res.render('home/homepage', {
                parentCat: parentCat,
                matrixChildCat: matrixChildCat,
                productsBestBegCount: productsBestBegCount,
                productsTopEndDate: productsTopEndDate,
                productsTopHightestPrice: productsTopHightestPrice,
                title: "Homepage"
            });
        }
    } else {
        res.render('home/homepage', {
            parentCat: parentCat,
            matrixChildCat: matrixChildCat,
            productsBestBegCount: productsBestBegCount,
            productsTopEndDate: productsTopEndDate,
            productsTopHightestPrice: productsTopHightestPrice,
            title: "Homepage"
        });

    }

});
router.get('/product/:proID', async(req, res) => {
    let { proID } = req.params
    const product = await mProduct.getOnebyId(proID);
    console.log('pro', product[0])
    const cate = await mCat.getOnebyId(proID);
    const subImg = await mProduct.getSubImage(proID)
    const token = req.cookies.jwt
    let bidderCanBid = false
    if (typeof token == "string") {
        const payload = await auth.verifyToken(token);
        console.log("Abc" + JSON.stringify(payload));
        const numberOfGoodReview = await mReview.getNumberOfGoodReview(payload.uID)
        let enoughGoodReview = numberOfGoodReview >= numberOfGoodReviewBidderRequried ? true : false
        let notBanned = true
        bidderCanBid = enoughGoodReview && notBanned
        res.render('product/product', {'product': product[0], 'cate': cate[0], 'subImg': subImg, 'bidderCanBid': bidderCanBid, 'recommendPrice': product[0].curPrice + product[0].stepPrice})
    }
    else {
        res.render('product/product', {'product': product[0], 'cate': cate[0], 'subImg': subImg, 'bidderCanBid': bidderCanBid})
    }
});
router.post('/login', async(req, res) => {
    const data = JSON.parse(JSON.stringify(req.body));
    const resLogin = await mUser.resLogin(data.uname, data.passwd);
    //console.log(resLogin);

    if (resLogin.length) {
        const payload = {
            uID: resLogin[0].id,
            roleID: resLogin[0].id_role,
            fullName: resLogin[0].fullName,
            roleName: resLogin[0].byname,
        };
        const token = await auth.generateToken(payload);
        //console.log(token);
        res.cookie('jwt', token);
        res.redirect('/');
    } else {
        res.render('error');
    }

});


///////////////////////////////////////////////////
router.get('/category/:ID/products', async(req, res) => {
    const token = req.cookies.jwt;

    const id = parseInt(req.params.ID);
    const page = parseInt(req.query.page) || 1;

    const catDetail = await mCat.getCatbyID(id);

    //load cho sideBar
    const parentCat = await mCat.getParentCategory();
    var matrixChildCat = [];
    for (var i = 0; i < parentCat.length; i++) {
        const listCDM = await mCat.getChildCategory(parentCat[i].ID);
        const data2 = JSON.parse(JSON.stringify(listCDM));
        matrixChildCat.push(data2);

    }


    //PHÂN TRANG
    //catsFromDB[id - 1].isActive = true; // hien thi cho side bar
    //san pham theo trang
    const rs = await mProduct.getProductsByCatIdPaging(id, page);
    console.log("tong page: " + rs.pageTotal);

    const pages = []; //luu mang cac trang hien len  |1|2|3|4|5|6|7|
    for (let i = 1; i <= rs.pageTotal; i++) {
        pages[i] = {
            value: i,
            active: (i) === page
        };
    }

    const navs = {}; // nav co gia tri la gia tri truoc trang duoc queery trong tham so url, neu page query la 1, thi nav.prev= null
    if (page > 1) {
        navs.prev = page - 1; // khi nhan vao nut prev thi page can lay la bn
    }
    if (page < rs.pageTotal) {
        navs.next = page + 1; // khi nhan vao nut next thi page can lay la bn
    }


    if (typeof token == "string") {
        const payload = await auth.verifyToken(token);
        if (payload.roleName == "admin") {
            res.redirect(`/${payload.roleName}`);
        } else {
            const payload = await auth.verifyToken(token);

            res.render('category/category', {
                parentCat: parentCat,
                catDetail: catDetail[0],
                matrixChildCat: matrixChildCat,
                list: rs.products,
                pages: pages,
                navs: navs,
                title: "Category"
            });
        }
    } else {
        res.render('category/category', {
            parentCat: parentCat,
            catDetail: catDetail[0],
            matrixChildCat: matrixChildCat,
            list: rs.products,
            pages: pages,
            navs: navs,
            title: "Category"
        });

    }


});

module.exports = router;