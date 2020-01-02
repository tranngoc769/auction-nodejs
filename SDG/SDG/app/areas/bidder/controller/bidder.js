const express = require("express");
const router = express.Router();
// const mUser = require("../../models/user");
// const mProduct = require("../../models/product");
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
router.get("/watchlist/:proID", async (req, res) => {
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
  console.log("/bid");
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
      res.redirect(`/product/${proID}`);
    } else {
      res.redirect(`/product/${proID}`);
    }
  } else {
    res.redirect(`/product/${proID}`);
  }
});
module.exports = router;
