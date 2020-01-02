const express = require('express');
const router = express.Router();
const mUser = require('../../../models/user');
const mCate = require('../../../models/category');
const mProduct = require('../../../models/product');
//If the data was sent as JSON
router.use(express.json());
//If the data was sent using Content-Type: application/x-www-form-urlencoded
router.use(express.urlencoded({ extended: false }));
//
router.get('/', async (req, res) => {
    res.render("account/admin/homepage",
        { layout: 'adminLayout' });
});
//User
router.get('/user', async (req, res) => {
    res.render("account/admin/account_list",
        {
            layout: 'adminLayout',
            tab: 'user'
        });
});
router.get('/getAllUser', async (req, res) => {
    var datareq = {};
    datareq.page = parseInt(req.query.pagination.page);
    datareq.perpage = parseInt(req.query.pagination.perpage);
    datareq.pages = 0;
    datareq.total = 0;
    datareq.field = 'id';
    datareq.sort = 'desc';

    if (typeof req.query.pagination.total != 'undefined') { datareq.total = req.query.pagination.total; }
    if (typeof req.query.sort != 'undefined') { datareq.sort = req.query.sort.sort; }
    if (typeof req.query.sort != 'undefined') { datareq.field = req.query.sort.field; }

    //console.log(datareq);
    let querysearch = '';
    if (req.query.query != '') {
        querysearch = req.query.query.search;
    };
    const uNameInfo = await mUser.getCustomer(datareq.page, datareq.perpage, querysearch, datareq.field, datareq.sort);
    datareq.total = (await mUser.getAllUser()).length;
    var meta = {};
    meta.page = datareq.page;
    meta.perpage = datareq.perpage;
    meta.pages = Math.ceil(datareq.total / datareq.perpage);
    meta.total = datareq.total;
    meta.field = datareq.field;
    meta.sort = datareq.sort;
    var result = {};
    result.meta = meta;
    result.data = uNameInfo;
    //console.log(result);
    res.json(result);
});
router.post('/updateRole', async (req, res) => {
    const data = JSON.parse(JSON.stringify(req.body));
    var arr = data.data.split('-');
    console.log(arr);
    arr.forEach(async p => {
        const status = await mUser.getWantToUpdate(parseInt(p));
        var entity = {};
        entity.id = parseInt(p);
        entity.id_role = 5 - parseInt(status[0].id_role);
        console.log(entity);
        if (status[0].id_role == 2) {
            if (status[0].wantToUpdate == 1) {
                entity.wantToUpdate = 0;
                const data = await mUser.responseUpdateRole(entity);
                console.log(data);
            }
            else {
                res.json('failure');
            }
        }
        else {
            const data = await mUser.responseUpdateRole(entity);
            console.log(data);
        }

    })

    res.json('successfull');
});
//category
router.get('/cate', async (req, res) => {
    const data = await mCate.getParentCate();
    res.render("account/admin/cate_list",
        {
            layout: 'adminLayout',
            data,
            tab: 'common'
        });
});
router.get('/getAllCategory', async (req, res) => {
    var datareq = {};
    datareq.page = parseInt(req.query.pagination.page);
    datareq.perpage = parseInt(req.query.pagination.perpage);
    datareq.pages = 0;
    datareq.total = 0;
    datareq.field = 'ID';
    datareq.sort = 'desc';

    if (typeof req.query.pagination.total != 'undefined') { datareq.total = req.query.pagination.total; }
    if (typeof req.query.sort != 'undefined') { datareq.sort = req.query.sort.sort; }
    if (typeof req.query.sort != 'undefined') { datareq.field = req.query.sort.field; }

    console.log(datareq);
    let querysearch = '';
    if (req.query.query != '') {
        querysearch = req.query.query.search;
    };
    const Info = await mCate.getAllCategory(datareq.page, datareq.perpage, querysearch, datareq.field, datareq.sort);
    datareq.total = (await mCate.getSencondaryCate()).length;
    var meta = {};
    meta.page = datareq.page;
    meta.perpage = datareq.perpage;
    meta.pages = Math.ceil(datareq.total / datareq.perpage);
    meta.total = datareq.total;
    meta.field = datareq.field;
    meta.sort = datareq.sort;
    var result = {};
    result.meta = meta;
    result.data = Info;
    console.log(result);
    res.json(result);
})
router.post('/delCate', async (req, res) => {
    const data = JSON.parse(JSON.stringify(req.body));
    var arr = data.data.split('-');
    let count = 0;
    console.log(arr);
    arr.forEach(async p => {
        const products = await mProduct.getProductOfCate(parseInt(p));
        if (products.length > 0) {
            let CateFail = parseInt(p);
            console.log(CateFail);
            res.json(CateFail);
        }
        else {
            const status = mCate.delByID(parseInt(p)).then(function () {
                count = count + 1;
                if (count == arr.length) {
                    res.json('successfull');
                }
            })
                .catch(function (err) { res.json(err) });
        }
    })
})
router.post('/updateCate', async (req, res) => {
    const data = JSON.parse(JSON.stringify(req.body));
    console.log(data);
    var entity = {};
    entity.ID = data.cateID;
    entity.Catname = data.cateName;
    if (data.parentCateID != 0) {
        entity.parentID = parseInt(data.parentCateID);
    }
    else {
        entity.parentID = null;
    }
    mCate.UpdateCate(entity)
        .then(res.redirect('/admin/cate'))
        .catch();

})
router.post('/createCate', async (req, res) => {
    const data = JSON.parse(JSON.stringify(req.body));
    console.log(data);
    var entity = {};
    entity.Catname = data.cateName;
    if (data.parentCateID != 0) {
        entity.parentID = parseInt(data.parentCateID);
    }
    else {
        entity.parentID = null;
    }
    mCate.AddOneCate(entity)
        .then(res.redirect('/admin/cate'))
        .catch();
})
//product
router.get('/product', async (req, res) => {
    res.render("account/admin/product_list",
        {
            layout: 'adminLayout',
            tab: 'common'
        });
});
router.get('/getAllProduct', async (req, res) => {
    var datareq = {};
    datareq.page = parseInt(req.query.pagination.page);
    datareq.perpage = parseInt(req.query.pagination.perpage);
    datareq.pages = 0;
    datareq.total = 0;
    datareq.field = 'ID';
    datareq.sort = 'desc';

    if (typeof req.query.pagination.total != 'undefined') { datareq.total = req.query.pagination.total; }
    if (typeof req.query.sort != 'undefined') { datareq.sort = req.query.sort.sort; }
    if (typeof req.query.sort != 'undefined') { datareq.field = req.query.sort.field; }

    console.log(datareq);
    let querysearch = '';
    if (req.query.query != '') {
        if (typeof req.query.query.search != 'undefined') {

            querysearch = req.query.query.search;
        }
    };
    const Info = await mProduct.getAllProduct(datareq.page, datareq.perpage, querysearch, datareq.field, datareq.sort);
    datareq.total = (await mProduct.getAllProducts()).length;
    var meta = {};
    meta.page = datareq.page;
    meta.perpage = datareq.perpage;
    meta.pages = Math.ceil(datareq.total / datareq.perpage);
    meta.total = datareq.total;
    meta.field = datareq.field;
    meta.sort = datareq.sort;
    var result = {};
    result.meta = meta;
    result.data = Info;
    console.log(result);
    res.json(result);
})
router.post('/delProduct', async (req, res) => {
    const data = JSON.parse(JSON.stringify(req.body));
    var arr = data.data.split('-');
    let count = 0;
    console.log(arr);
    arr.forEach(async p => {
        const status = mProduct.delByID(parseInt(p)).then(function () {
            count = count + 1;
            if (count == arr.length) {
                res.json('successfull');
            }
        })
            .catch(function (err) { res.json(err) });
    }
    )
})
module.exports = router;
