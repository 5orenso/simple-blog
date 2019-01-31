'use strict';

const webUtil = require('../../../lib/web-util');

const router = require('express').Router();

router.get('/:category/:title/:id', require('./get-article.js'));
router.get('/:category/:filename', require('./get-article.js'));

module.exports = router;
