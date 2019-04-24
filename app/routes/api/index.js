'use strict';

const router = require('express').Router();
const cors = require('cors');
const wrap = require('../../middleware/wrap');
const util = require('../../../lib/utilities');

router.use(cors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    preflightContinue: true, // All domains should be allowed by default to contact our API.
}));

router.get('/article/', wrap(require('./get-article.js')));
router.get('/article/:id', wrap(require('./get-article.js')));
router.patch('/article/:id', util.restrict, wrap(require('./patch-article.js')));
router.post('/article/', util.restrict, wrap(require('./post-article.js')));

router.get('/image/', wrap(require('./get-image.js')));
router.get('/image/:id', wrap(require('./get-image.js')));

router.get('/category/', wrap(require('./get-category.js')));
router.get('/category/:id', wrap(require('./get-category.js')));
router.patch('/category/:id', util.restrict, wrap(require('./patch-category.js')));

router.get('/tag/', wrap(require('./get-tag.js')));
router.get('/tag/:id', wrap(require('./get-tag.js')));
router.post('/tag/', util.restrict, wrap(require('./post-tag.js')));

router.get('/author/', wrap(require('./get-author.js')));
router.get('/author/:id', wrap(require('./get-author.js')));
router.post('/author/', util.restrict, wrap(require('./post-author.js')));

router.post('/fileupload/', util.restrict, wrap(require('./post-fileupload.js')));

module.exports = router;
