/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2017 Øistein Sørensen
 * Licensed under the MIT license.
 */

'use strict';

// const util = require('./utilities');
const swig = require('swig');
const ArticleUtil = require('./article-util');
const util = require('./utilities');

const articleUtil = new ArticleUtil();

swig.setFilter('markdown', articleUtil.replaceMarked);
swig.setFilter('formatted', articleUtil.formatDate);
swig.setFilter('substring', articleUtil.substring);
swig.setFilter('cleanHtml', articleUtil.cleanHtml);
swig.setFilter('fixFilename', articleUtil.fixFilename);
swig.setFilter('removeLineBreaks', articleUtil.removeLineBreaks);
swig.setFilter('match', articleUtil.match);
swig.setFilter('inlineImageSize', articleUtil.inlineImageSize);
swig.setFilter('oneline', articleUtil.oneline);
swig.setFilter('duration', articleUtil.duration);

// V2 formatting:
swig.setFilter('md', util.replaceMarked);
swig.setFilter('imgSize', util.inlineImageSize);
swig.setFilter('dataTags', util.replaceDataTags);
swig.setFilter('dropFirstLetter', util.dropFirstLetter);
swig.setFilter('dropFirstLetterAfterHr', util.dropFirstLetterAfterHr);

// const nobreaks = require('./swig-extensions/nobreaks-tag.js');
//
// swig.setTag('nobreaks', nobreaks.parse, nobreaks.compile, nobreaks.ends, nobreaks.blockLevel);

module.exports = swig;
