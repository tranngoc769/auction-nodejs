const express = require('express');
const router = express.Router();
const mUser = require('../../models/user');
const mProduct = require('../../models/product');
const mReview = require('../../models/review');
const mCat = require('../../models/category');
const mHis = require('../../models/history');
const auth = require('../../utils/auth');
const mBanned = require("../../models/bannded");
const sha = require('sha.js');
const nodemailer = require("nodemailer");
const smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "nghqquyen@gmail.com",
        pass: "01668519884"
    }
});
var rand, mailOptions;
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
    const parentCat = await mCat.getParentCategory();
    var matrixChildCat = [];
    for (var i = 0; i < parentCat.length; i++) {
        const listCDM = await mCat.getChildCategory(parentCat[i].ID);
        const data2 = JSON.parse(JSON.stringify(listCDM));
        matrixChildCat.push(data2);

    }
    let { proID } = req.params
    console.log('pro', proID)
    const product = await mProduct.getOnebyId(proID);
    console.log('pro', product)
    const cate = await mCat.getOnebyId(product[0].catId);
    product[0].pubDate = moment().format("HH:mm:ss DD-MM-YYYY");
    product[0].endDate = moment().format("HH:mm:ss DD-MM-YYYY");
    const subImg = await mProduct.getSubImage(proID);
    const subImg2 = await mProduct.getSubImageAfterFirst(proID);
    const seller = await mProduct.getSellerByProID(proID);
    const bidder = await mProduct.getHightestBidderByProID(proID);
    const recommendPro = await mProduct.getTop4OnebyId(product[0].catId);
    const his = await mHis.getHistoryByProductID(proID)
    await his.forEach(async h => {
        const pro = await mUser.getUserInfo(h.userID)
        const name = await pro[0].fullName.split(" ")
        const hideName = await ("*****" + name[name.length - 1]).toString()
        h.userName = hideName
    })



    const pages = []; //luu mang cac trang hien len  |1|2|3|4|5|6|7|
    for (let i = 1; i <= subImg2.length; i++) {
        pages[i] = {
            value: i
        };
    }

    const token = req.cookies.jwt
    let bidderCanBid = false
    if (typeof token == "string") {
        const payload = await auth.verifyToken(token);
        const userID = payload.uID
        const numberOfGoodReview = await mReview.getNumberOfGoodReview(userID)
        let enoughGoodReview = numberOfGoodReview >= numberOfGoodReviewBidderRequried ? true : false
        let notBanned = !(await mBanned.isBanned(userID, proID))
        bidderCanBid = enoughGoodReview && notBanned
        console.log('his', his)
        res.render('product/product', {
            'product': product[0],
            parentCat: parentCat,
            matrixChildCat: matrixChildCat,
            'cate': cate[0],
            'subImg': subImg,
            'bidderCanBid': bidderCanBid,
            'recommendPrice': product[0].curPrice + product[0].stepPrice,
            title: "Product details",
            history: his,
            subImg2: subImg2,
            pages: pages,
            seller: seller[0],
            recommendPro: recommendPro,
            bidder: bidder[0]
        })
    } else {
        res.render('product/product', {
            'product': product[0],
            parentCat: parentCat,
            matrixChildCat: matrixChildCat,
            'cate': cate[0],
            'subImg': subImg,
            'bidderCanBid': bidderCanBid,
            title: "Product details",
            history: his,
            subImg2: subImg2,
            pages: pages,
            seller: seller[0],
            recommendPro: recommendPro,
            bidder: bidder[0]
        })
    }
});
//router.post('/login', async(req, res) => {
//    const data = JSON.parse(JSON.stringify(req.body));
//    const resLogin = await mUser.resLogin(data.uname, data.passwd);
//    //console.log(resLogin);

//    if (resLogin.length) {
//        const payload = {
//            uID: resLogin[0].id,
//            roleID: resLogin[0].id_role,
//            fullName: resLogin[0].fullName,
//            roleName: resLogin[0].byname,
//        };
//        const token = await auth.generateToken(payload);
//        //console.log(token);
//        res.cookie('jwt', token);
//        res.redirect('/');
//    } else {
//        res.render('error');
//    }

//});
router.post('/login', async(req, res) => {

    const data = JSON.parse(JSON.stringify(req.body));
    const uname = data.uname;
    const pword = data.passwd;
    const resLogin = await mUser.resLogin(uname);
    //console.log(resLogin);

    if (resLogin.length) {
        const pswDb = resLogin[0].password;
        const salt = pswDb.substring(64, pswDb.length);
        const preHash = pword + salt;
        const hash = sha('sha256').update(preHash).digest('hex');
        const pwHash = hash + salt;
        if (pswDb == pwHash) {
            const payload = {
                uID: resLogin[0].id,
                roleID: resLogin[0].id_role,
                fullName: resLogin[0].fullName,
                roleName: resLogin[0].byname,
                email: resLogin[0].EMAIL
            };
            const token = await auth.generateToken(payload);
            //console.log(token);
            res.cookie('jwt', token);
            res.redirect('/');
        } else {
            res.redirect('/login');
        }

    } else {
        res.redirect('/login');
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
router.post('/search/:page', async(req, res) => {
    const page = parseInt(req.params.page);
    const data = JSON.parse(JSON.stringify(req.body));
    const inputSearch = data.searchHere;

    const token = req.cookies.jwt;
    const curPrice = 'curPrice';
    const DESC = 'DESC';

    //const id = parseInt(req.params.ID);
    //const page = parseInt(req.query.page) || 1;

    console.log("page" + page)

    //const catDetail = await mCat.getCatbyID(id);

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
    const rs = await mProduct.getAllProduct(page, 5, inputSearch, curPrice, DESC);
    console.log(rs.length + "rrrrr");
    var pageTotal = Math.floor(rs.length / 5);
    if (rs.length % 5 != 0)
        pageTotal = pageTotal + 1;
    const pages = []; //luu mang cac trang hien len  |1|2|3|4|5|6|7|
    for (let i = 1; i <= pageTotal; i++) {
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
                matrixChildCat: matrixChildCat,
                list: rs,
                pages: pages,
                navs: navs,
                title: "Category"
            });
        }
    } else {
        res.render('home/search', {
            parentCat: parentCat,
            matrixChildCat: matrixChildCat,
            list: rs,
            pages: pages,
            navs: navs,
            title: "Category"
        });

    }

});
router.get('/login', async(req, res) => {
    res.render('home/login_register');
})
router.post('/register', async(req, res) => {
    const uname = req.body.uname;
    const pword = req.body.pword;
    const email = req.body.email;
    const phone = req.body.phone;
    const name = req.body.name;
    const dob = req.body.dob;

    //salt
    const salt = Date.now().toString(16);
    const preHash = pword + salt;
    const hash = sha('sha256').update(preHash).digest('hex');
    const pwHash = hash + salt;
    const user = {
        username: uname,
        password: pwHash,
        id_role: 2,
        EMAIL: email,
        isVerifyEmail: 0
    }
    const info = {
        fullName: name,
        phone: phone,
        DOB: dob
    }
    const uId = mUser.createAccount(user).then(async function(result) {
            info.accountID = result;
            const m = await mUser.createInfo(info);
            const payload = {
                uID: result,
                roleID: 2,
                fullName: name,
                roleName: 'bidder',
                email: email
            };
            const token = await auth.generateToken(payload);
            //console.log(token);
            res.cookie('jwt', token);
            res.redirect('/send');
        })
        .catch();

})
router.get('/send', async function(req, res) {
    rand = generateOTP();
    const token = req.cookies.jwt;
    let payload = {};
    //console.log(token);
    if (typeof token == "string") {
        payload = await auth.verifyToken(token);
    }
    //host = req.get('host');
    //link = "http://" + req.get('host') + "/verify?id=" + rand;
    mailOptions = {
        to: payload.email,
        subject: "Please confirm your Email account",
        html: "Hello,<br> Here is your OTP :" + rand
    }
    console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function(error, response) {
        if (error) {
            console.log(error);
            res.end("error");
        } else {
            console.log("Message sent: " + response);
            res.cookie('otp', 10000 - rand);
            res.render('home/verify');
        }
    });
});
router.post('/verify', function(req, res) {
    const data = JSON.parse(JSON.stringify(req.body));
    if (req.cookies.otp == 10000 - data.otp) {
        //update isverify
        res.clearCookie("otp");
        let entity = {};
        entity.id = res.locals.id;
        entity.isVerifyEmail = 1;
        const a = mUser.veryfileEmail(entity);
        res.json('successfull');
    } else {
        res.json('failure');
    }
});

function generateOTP() {

    // Declare a digits variable  
    // which stores all digits 
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 4; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}
module.exports = router;