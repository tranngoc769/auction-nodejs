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
router.get('/', async(req, res) => {
    //console.log(req.cookies.jwt);
    const token = req.cookies.jwt;
    //console.log(token);
    if (typeof token == "string") {
        const payload = await auth.verifyToken(token);
        //console.log("Abc" + JSON.stringify(payload));
        //const role = await mRole.getOnebyId(payload.roleID);
        if (payload.roleName == "admin") {
            res.redirect(`/${payload.roleName}`);
        } else {
            //console.log(payload.roleName);
            res.render('home/homepage');
        }
    } else {
        res.render('home/homepage');
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

module.exports = router;