'use strict';

const router = require('express').Router();
const wrap = require('../../middleware/wrap');

router.get('/search', wrap(require('./get-search')));
router.get('/iot/', wrap(require('./get-iot')));

router.get('/:category/:title/:id', wrap(require('./get-article')));
router.get('/:category/:filename', wrap(require('./get-article')));
router.get('/:category/', wrap(require('./get-article')));
router.get('/', wrap(require('./get-article')));

module.exports = router;
