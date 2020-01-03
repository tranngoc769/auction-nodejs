const express = require("express");
const router = express.Router();
const mUser = require("../../../models/user");
const mProduct = require("../../../models/product");
const mReview = require("../../../models/review");
// const mCate = require("../../models/category");
const mWL = require("../../../models/watchlist");
const mHistory = require("../../../models/history");
const mBReview = require("../../../models/bidderreview");
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
      await mHistory.addToHistory(userID, proID, price)
      await mProduct.updateHighestBidder(userID, proID)
      
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
//
router.get("/profile", async (req, res) => {
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
      const userAccount = await mUser.getUserAccount(userID)
      const userInfo = await mUser.getUserInfo(userID)
      const review = await mReview.getReviewByBidderID(userID)
      console.log(userAccount)
      res.render('bidder/profile', {'userAccount': userAccount[0], 'userInfo': userInfo[0], 'review': review});
      
    } else {
      res.render('error/error');
    }
  } else {
    res.render('error/error');  
  }
});

router.post("/changepassword", async (req, res) => {
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
      const {password} = req.body
      await mUser.updateUserPassword(userID, password)
      res.redirect(`/bidder/profile`);
    } else {
      res.redirect(`/bidder/profile`);
    }
  } else {
    res.redirect(`/bidder/profile`);
  }
});

router.post("/changeinfo", async (req, res) => {
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
      const {email, name, phone} = req.body
      await mUser.updateUserInfo(userID, email, name, phone)
      res.redirect(`/bidder/profile`);
    } else {
      res.redirect(`/bidder/profile`);
    }
  } else {
    res.redirect(`/bidder/profile`);
  }
});

//
router.get("/review/:proID", async (req, res) => {
  const {proID} = req.params
  ////console.log(req.cookies.jwt);
  const token = req.cookies.jwt;
  ////console.log(token);
  if (typeof token == "string") {
    const payload = await auth.verifyToken(token);
    //console.log("Abc" + JSON.stringify(payload));
    //const role = await mRole.getOnebyId(payload.roleID);
    if (payload.roleName == "bidder") {
      const payload = await auth.verifyToken(token);
      const bidderID = payload.uID;
      const products = await mProduct.getOnebyId(proID)
      const product = products[0]
      const sellerID = product.sellerID
      const reviews = await mBReview.getReviewBySellerID(sellerID)
      res.render('bidder/review', {'bidderID': bidderID, 'sellerID': sellerID, 'reviews': reviews, 'proID': proID})
    } else {
      res.render('error/error');
    }
  } else {
    res.render('error/error');  
  }
});

router.post("/:proID/reviewseller/:sellerID", async (req, res) => {
  ////console.log(req.cookies.jwt);
  const {proID, sellerID} = req.params
  const token = req.cookies.jwt;
  console.log('token');
  if (typeof token == "string") {
    const payload = await auth.verifyToken(token);
    //console.log("Abc" + JSON.stringify(payload));
    //const role = await mRole.getOnebyId(payload.roleID);
    if (payload.roleName == "bidder") {
      const payload = await auth.verifyToken(token);
      const bidderID = payload.uID;
      const {comment} = req.body
      await mBReview.addReview(bidderID, sellerID, comment)
      res.redirect(`/bidder/review/${proID}`);
    } else {
      res.redirect(`/bidder/review/${proID}`);
    }
  } else {
    res.redirect(`/bidder/review/${proID}`);
  }
});

module.exports = router;
