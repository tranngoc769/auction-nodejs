const express = require("express");
const router = express.Router();
// const mUser = require("../../models/user");
const mProduct = require("../../../models/product");
// const mReview = require("../../models/review");
// const mCate = require("../../models/category");
const mWL = require("../../../models/watchlist");
const mHistory = require("../../../models/history");
const auth = require("../../../utils/auth");
router.use(express.json());
//If the data was sent using Content-Type: application/x-www-form-urlencoded
router.use(express.urlencoded({ extended: false }));
//

function mysqlDate(date){
    date = date || new Date();
    return date.toISOString().split('T')[0];
}
//
router.get("/addwatchlist/:proID", async (req, res) => {
  ////console.log(req.cookies.jwt);
  const { proID } = req.params;
  const token = req.cookies.jwt;
  ////console.log(token);
  if (typeof token == "string") {
    const payload = await auth.verifyToken(token);
    //console.log("Abc" + JSON.stringify(payload));
    //const role = await mRole.getOnebyId(payload.roleID);
    if (payload.roleName == "bidder") {
      const payload = await auth.verifyToken(token);
      const userID = payload.uID;
      await mWL.addToWatchList(userID, proID);
      res.redirect(`/product/${proID}`);
    } else {
      res.redirect(`/product/${proID}`);
    }
  } else {
    res.redirect(`/product/${proID}`);
  }
});

router.post("/bid/:proID", async (req, res) => {
  ////console.log(req.cookies.jwt);
  const { proID } = req.params;
  const token = req.cookies.jwt;
  ////console.log(token);
  if (typeof token == "string") {
    const payload = await auth.verifyToken(token);
    //console.log("Abc" + JSON.stringify(payload));
    //const role = await mRole.getOnebyId(payload.roleID);
    if (payload.roleName == "bidder") {
      const payload = await auth.verifyToken(token);
      const userID = payload.uID;
      const price = req.body.price;
      mHistory.addToHistory(userID, proID, price)
      mProduct.updateHighestBidder(userID, proID)
      
      res.redirect(`/product/${proID}`);
    } else {
      res.redirect(`/product/${proID}`);
    }
  } else {
    res.redirect(`/product/${proID}`);
  }
});
//
router.get("/watchlist", async (req, res) => {
  ////console.log(req.cookies.jwt);
  const token = req.cookies.jwt;
  ////console.log(token);
  if (typeof token == "string") {
    const payload = await auth.verifyToken(token);
    //console.log("Abc" + JSON.stringify(payload));
    //const role = await mRole.getOnebyId(payload.roleID);
    if (payload.roleName == "bidder") {
      const payload = await auth.verifyToken(token);
      const userID = payload.uID;
      const wl = await mWL.getWatchList(userID);
      const l_wl = wl.length
      let products = []
      for(i =0;i<l_wl;i++){
        newP = await mProduct.getOnebyId(wl[i].proID)
        addP = newP[0]
        addP.isPriceKeeper = addP.HighestBidderID === userID ? true : false
        products = [...products, addP]
      }
      res.render('bidder/list', {'userID': userID, 'products': products, 'title': 'Những sản phẩm bạn yêu thích'});
      
    } else {
      res.render('error/error');
    }
  } else {
    res.render('error/error');  
  }
});
//
router.get("/bidding", async (req, res) => {
  ////console.log(req.cookies.jwt);
  const token = req.cookies.jwt;
  ////console.log(token);
  if (typeof token == "string") {
    const payload = await auth.verifyToken(token);
    //console.log("Abc" + JSON.stringify(payload));
    //const role = await mRole.getOnebyId(payload.roleID);
    if (payload.roleName == "bidder") {
      const payload = await auth.verifyToken(token);
      const userID = payload.uID;
      const products = await mProduct.getProductBidderInHistory(userID)
      products.map(p => {
        p.isPriceKeeper = (p.HighestBidderID === userID) ? true : false
      })
      res.render('bidder/list', {'userID': userID, 'products': products, 'title': 'Những sản phẩm bạn tham gia đấu giá'});
      
    } else {
      res.render('error/error');
    }
  } else {
    res.render('error/error');  
  }
});
//
router.get("/wonlist", async (req, res) => {
  ////console.log(req.cookies.jwt);
  const token = req.cookies.jwt;
  ////console.log(token);
  if (typeof token == "string") {
    const payload = await auth.verifyToken(token);
    //console.log("Abc" + JSON.stringify(payload));
    //const role = await mRole.getOnebyId(payload.roleID);
    if (payload.roleName == "bidder") {
      const payload = await auth.verifyToken(token);
      const userID = payload.uID;
      const products = await mProduct.getBidderWonProduct(userID)
      products.map(p => {
        p.isPriceKeeper = (p.HighestBidderID === userID) ? true : false
      })

      res.render('bidder/list', {'userID': userID, 'products': products, 'title': 'Những sản phẩm bạn tham gia đấu giá'});
      
    } else {
      res.render('error/error');
    }
  } else {
    res.render('error/error');  
  }
});
module.exports = router;
