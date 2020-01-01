const express = require('express');
const router = express.Router();
const mUser = require('../../models/user');
const mRole = require('../../models/role');
const mProduct = require('../../models/product');
const mReview = require('../../models/review');
const mCate = require('../../models/category');
const auth = require('../../utils/auth');
//Number of good review for bidder to bid
const numberOfGoodReviewBidderRequried = 1 // 1 for testing, correct is 5
//If the data was sent as JSON
router.use(express.json());
//If the data was sent using Content-Type: application/x-www-form-urlencoded
router.use(express.urlencoded({ extended: false }));
//
router.get('/', async (req, res) => {
    ////console.log(req.cookies.jwt);
    const token = req.cookies.jwt;
    ////console.log(token);
    if (typeof token == "string") {
        const payload = await auth.verifyToken(token);
        //console.log("Abc" + JSON.stringify(payload));
        //const role = await mRole.getOnebyId(payload.roleID);
        if (payload.roleName == "admin") {
            res.redirect(`/${payload.roleName}`);
        }
        else {
            //console.log(payloa
         const payload = await auth.verifyToken(token);
         console.log(" aaaaaaaaaaaaaaa : "+ payload.uID);
         
            res.render('home/homepage');
        }
    }
    else {
        const payload = await auth.verifyToken(token);
        const uNameInfo = await mUser.getUserInfo(payload.uID);
        res.render('home/homepage');
        
    }

});
router.get('/product/:proID', async (req, res) => {
    let {proID} = req.params
    const product = await mProduct.getOnebyId(proID);
    console.log('pro', product[0])
    const cate = await mCate.getOnebyId(proID);
    const subImg = await mProduct.getSubImage(proID)
    const token = req.cookies.jwt
    let bidderCanBid = false
    if (typeof token == "string") {
        const payload = await auth.verifyToken(token);
        console.log("Abc" + JSON.stringify(payload));
        const numberOfGoodReview = await mReview.getNumberOfGoodReview(payload.uID)
        bidderCanBid = numberOfGoodReview >= numberOfGoodReviewBidderRequried ? true : false
        console.log(bidderCanBid)
        res.render('product/product', {'product': product[0], 'cate': cate[0], 'subImg': subImg, 'bidderCanBid': bidderCanBid})
    }
    else {
        res.render('home/homepage');
        res.render('product/product', {'product': product[0], 'cate': cate[0], 'subImg': subImg, 'bidderCanBid': bidderCanBid})
    }
});
router.post('/login', async (req, res) => {
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
    }
    else {
        res.render('error');
    }

});

module.exports = router;
