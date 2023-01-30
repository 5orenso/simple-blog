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

router.post('/translate/', util.restrict, wrap(require('./post-translate')));
// router.get('/instagram/', util.restrict, wrap(require('./get-instagram')));

router.get('/info', wrap(require('./get-info')));

router.use('/bookings/', wrap(require('./bookings/')));
router.use('/forms/', wrap(require('./forms/')));
router.use('/sheets/', wrap(require('./sheets/')));
router.use('/yr/', wrap(require('./yr/')));
router.use('/proxy/', wrap(require('./proxy/')));

router.get('/article/public/', wrap(require('./get-article')));
router.get('/article/public/:id', wrap(require('./get-article')));
router.patch('/article/public/:id', util.restrict, wrap(require('./patch-article')));
router.post('/article/public/', util.restrict, wrap(require('./post-article')));

router.get('/article/', wrap(require('./get-article')));
router.get('/article/:id', wrap(require('./get-article')));
router.patch('/article/:id', util.restrict, wrap(require('./patch-article')));
router.post('/article/', util.restrict, wrap(require('./post-article')));


router.get('/image/', wrap(require('./get-image')));
router.get('/image/:id', wrap(require('./get-image')));

router.get('/category/', wrap(require('./get-category')));
router.get('/category/:id', wrap(require('./get-category')));
router.patch('/category/:id', util.restrict, wrap(require('./patch-category')));
router.post('/category/', util.restrict, wrap(require('./post-category')));

// router.get('/iotdevice/', wrap(require('./get-iotDevice')));
// router.get('/iotdevice/:id', wrap(require('./get-iotDevice')));
// router.patch('/iotdevice/:id', util.restrict, wrap(require('./patch-iotDevice')));
// router.post('/iotdevice/', util.restrict, wrap(require('./post-iotDevice')));

// router.get('/iot/', wrap(require('./get-iot')));
// router.get('/iot/:id', wrap(require('./get-iot')));
// router.get('/iot/:id/data', wrap(require('./get-iot-data')));
// router.patch('/iot/:id', util.restrict, wrap(require('./patch-iot')));
// router.post('/iot/', util.restrict, wrap(require('./post-iot')));


router.get('/tag/', wrap(require('./get-tag')));
router.get('/tag/:id', wrap(require('./get-tag')));
router.post('/tag/', util.restrict, wrap(require('./post-tag')));

router.get('/author/', wrap(require('./get-author')));
router.get('/author/:id', wrap(require('./get-author')));
router.post('/author/', util.restrict, wrap(require('./post-author')));

router.post('/fileupload/', util.restrict, wrap(require('./post-fileupload')));

router.post('/send-magic-link', require('../send-magic-link'));

module.exports = router;
