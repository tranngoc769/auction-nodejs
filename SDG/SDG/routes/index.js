'use strict';
var express = require('express');
var router = express.Router();

/* GET home page. */
router.use('/', require('../app/home/controller/home'));
module.exports = router;
