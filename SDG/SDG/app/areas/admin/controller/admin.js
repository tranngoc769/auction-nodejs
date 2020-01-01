const express = require('express');
const router = express.Router();
const mUser = require('../../../models/user');
//If the data was sent as JSON
router.use(express.json());
//If the data was sent using Content-Type: application/x-www-form-urlencoded
router.use(express.urlencoded({ extended: false }));
//
router.get('/', async (req, res) => {
    res.render("account/admin/homepage",
        { layout: 'adminLayout' });
});
router.get('/user', async (req, res) => {
    res.render("account/admin/account_list",
        { layout: 'adminLayout' });
});
router.get('/getAllUser', async (req, res) => {
    var datareq = {};
    datareq.page = parseInt(req.query.pagination.page);
    datareq.perpage = parseInt(req.query.pagination.perpage);
    datareq.pages = 0;
    datareq.total = 0;
    datareq.field = 'id';
    datareq.sort = 'desc';

    if (typeof req.query.pagination.total != 'undefined') { datareq.total = req.query.pagination.total;}
    if (typeof req.query.sort != 'undefined') { datareq.sort = req.query.sort.sort;}
    if (typeof req.query.sort != 'undefined') { datareq.field = req.query.sort.field;}

    //console.log(datareq);
    let querysearch = '';
    if (req.query.query != '')
    {
        querysearch = req.query.query.search;
    };
    const uNameInfo = await mUser.getCustomer(datareq.page, datareq.perpage, querysearch,datareq.field,datareq.sort);
    datareq.total = uNameInfo.length;
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
module.exports = router;
