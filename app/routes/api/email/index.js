'use strict';

const router = require('express').Router();
const cors = require('cors');
const wrap = require('../../../middleware/wrap');
const util = require('../../../../lib/utilities');

router.use(cors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    preflightContinue: true, // All domains should be allowed by default to contact our API.
}));

// Routes:
router.post('/', util.restrict, wrap(require('./post-email')));
router.post('/plain', util.restrict, wrap(require('./post-email-plain')));

module.exports = router;
