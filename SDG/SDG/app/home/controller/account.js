const express = require('express');
const router = express.Router();
const mUser = require('../../models/user');
const mRole = require('../../models/role');
const auth = require('../../utils/auth');
//If the data was sent as JSON
router.use(express.json());
//If the data was sent using Content-Type: application/x-www-form-urlencoded
router.use(express.urlencoded({ extended: false }));
//
router.get('/myprofile', async (req, res) => {
    //console.log(req.cookies.jwt);
    const token = req.cookies.jwt;
    console.log(token);
    if (typeof token == "string") {
        const payload = await auth.verifyToken(token);
        const uNameInfo = await mUser.getUserInfo(payload.uID);
        res.render('account/userprofile', { Info: uNameInfo[0] });
    }
    else {
        res.render('home/homepage');
    }

});
router.get('/logout', async (req, res) => {
    res.clearCookie("jwt");
    res.redirect("/");
});

module.exports = router;
