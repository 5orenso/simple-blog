/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2017 Øistein Sørensen
 * Licensed under the MIT license.
 */

'use strict';

// const util = require('./utilities');
const swig = require('swig');
const util = require('./utilities');
const utilHtml = require('./util-html');

swig.setFilter('markdown', utilHtml.replaceMarked);
swig.setFilter('formatted', util.formatDate);
swig.setFilter('substring', util.substring);
swig.setFilter('cleanHtml', utilHtml.cleanHtml);
swig.setFilter('fixFilename', util.fixFilename);
swig.setFilter('removeLineBreaks', util.removeLineBreaks);
swig.setFilter('match', util.match);
swig.setFilter('inlineImageSize', utilHtml.inlineImageSize);
swig.setFilter('oneline', util.oneline);
swig.setFilter('duration', util.duration);
swig.setFilter('getStatus', util.getStatus);
swig.setFilter('getStatusClass', util.getStatusClass);
swig.setFilter('imageKeywords', util.imageKeywords);
swig.setFilter('format', util.format);

// V2 formatting:
swig.setFilter('md', utilHtml.replaceMarked);
swig.setFilter('imgSize', utilHtml.inlineImageSize);
swig.setFilter('dataTags', utilHtml.replaceDataTags);
swig.setFilter('dropFirstLetter', utilHtml.dropFirstLetter);
swig.setFilter('dropFirstLetterAfterHr', utilHtml.dropFirstLetterAfterHr);

swig.setFilter('asUrlSafe', utilHtml.asUrlSafe);
swig.setFilter('asLinkPart', utilHtml.asLinkPart);
swig.setFilter('stripTags', utilHtml.stripTags);
swig.setFilter('uc', utilHtml.uc);
swig.setFilter('asHumanReadable', util.asHumanReadable);

swig.setFilter('wordCount', util.wordCount);
swig.setFilter('secReadable', util.secReadable);
swig.setFilter('readTime', util.readTime);


// const nobreaks = require('./swig-extensions/nobreaks-tag.js');
//
// swig.setTag('nobreaks', nobreaks.parse, nobreaks.compile, nobreaks.ends, nobreaks.blockLevel);

module.exports = swig;
