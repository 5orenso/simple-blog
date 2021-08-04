'use strict';

const router = require('express').Router();
const { utilExpress: webUtil } = require('node-simple-utilities');
const wrap = require('../../../middleware/wrap');

// Routes:
router.get('/:sheetid', wrap(require('./get-booking')));
router.post('/:sheetid', wrap(require('./post-booking')));

module.exports = router;
