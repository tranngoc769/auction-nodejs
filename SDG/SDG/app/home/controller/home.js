const express = require('express');
const router = express.Router();
const mUser = require('../../models/user');
const mRole = require('../../models/role');
const jwt = require('jsonwebtoken');
//If the data was sent as JSON
router.use(express.json());
//If the data was sent using Content-Type: application/x-www-form-urlencoded
router.use(express.urlencoded({ extended: false }));
//
router.get('/', async (req, res) => {
    //console.log(req.cookies.jwt);
    const token = req.cookies.jwt;
    console.log(token);
    if (typeof token == "string") {
        jwt.verify(token, "kumeodeptrai", async function (err, payload) {
            console.log(payload);
            const role = await mRole.getOnebyId(payload.roleID);
            if (role[0].byname != "bidder") {
                res.redirect(`/${role[0].byname}`);
            }
            else {
                res.render('home/homepage');
            }
        })
    }
    else {
        res.render('home/homepage');
    }
    
});
router.post('/login', async (req, res) => {
    const data = JSON.parse(JSON.stringify(req.body));
    const resLogin = await mUser.resLogin(data.uname, data.passwd);
    console.log(resLogin);

    if (resLogin.length) {
        const payload = {
            uID: resLogin[0].id,
            roleID: resLogin[0].id_role,
        };
        const token = jwt.sign(JSON.stringify(payload), "kumeodeptrai");
        console.log(token);
        res.cookie('jwt', token);
        res.redirect('/home');
    }
    else {
        res.render('error');
    }

});

module.exports = router;
