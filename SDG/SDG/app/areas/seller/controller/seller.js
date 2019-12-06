const express = require('express');
const router = express.Router();
//If the data was sent as JSON
router.use(express.json());
//If the data was sent using Content-Type: application/x-www-form-urlencoded
router.use(express.urlencoded({ extended: false }));
//
router.get('/', async (req, res) => {
    res.render("account/seller/homepage");
});

module.exports = router;
