'use strict';

const router = require('express').Router();
const { utilExpress: webUtil } = require('node-simple-utilities');
const wrap = require('../../../middleware/wrap');

// Routes:
router.get('/', wrap(require('./get-compact')));

module.exports = router;
