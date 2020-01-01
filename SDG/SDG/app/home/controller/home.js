const express = require('express');
const router = express.Router();
const mUser = require('../../models/user');
const mRole = require('../../models/role');
const auth = require('../../utils/auth');

const mPro = require('../../models/product');
const mCat = require('../../models/category');


//If the data was sent as JSON
router.use(express.json());
//If the data was sent using Content-Type: application/x-www-form-urlencoded
router.use(express.urlencoded({ extended: false }));
//

router.get('/', async(req, res) => {
    const token = req.cookies.jwt;

    //load cho sideBar
    const parentCat = await mCat.getParentCategory();
    //const matrixChildCat = await mPro.getAllCatChild();


    const listParDM = await mCat.getParentCategory();
    const data = JSON.parse(JSON.stringify(listParDM));
    var matrixChildCat = [];
    for (var i = 0; i < data.length; i++) {
        const listCDM = await mCat.getChildCategory(data[i].ID);
        const data2 = JSON.parse(JSON.stringify(listCDM));
        matrixChildCat.push(data2);

    }

    if (typeof token == "string") {
        const payload = await auth.verifyToken(token);
        if (payload.roleName == "admin") {
            res.redirect(`/${payload.roleName}`);
        } else {
            const payload = await auth.verifyToken(token);

            res.render('home/homepage', {
                parentCat: parentCat,
                matrixChildCat: matrixChildCat
            });
        }
    } else {
        res.render('home/homepage', {
            parentCat: parentCat,
            matrixChildCat: matrixChildCat
        });

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