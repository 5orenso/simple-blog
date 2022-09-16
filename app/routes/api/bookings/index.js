'use strict';

const router = require('express').Router();
const { utilExpress: webUtil } = require('node-simple-utilities');
const wrap = require('../../../middleware/wrap');

// Routes:
router.get('/:sheetid', wrap(require('./get-booking')));
router.post('/:sheetid', wrap(require('./post-booking')));
router.post('/log/:sheetid', wrap(require('./post-log-booking')));

module.exports = router;
