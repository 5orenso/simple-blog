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

const articleUtil = new ArticleUtil();

swig.setFilter('markdown', articleUtil.replaceMarked);
swig.setFilter('formatted', articleUtil.formatDate);
swig.setFilter('substring', articleUtil.substring);
swig.setFilter('cleanHtml', articleUtil.cleanHtml);
swig.setFilter('fixFilename', articleUtil.fixFilename);
swig.setFilter('removeLineBreaks', articleUtil.removeLineBreaks);
swig.setFilter('match', articleUtil.match);
swig.setFilter('inlineImageSize', articleUtil.inlineImageSize);

// swig.setFilter('checkNested', util.checkNested);
// swig.setFilter('returnString', util.returnString);
// swig.setFilter('returnNumber', util.returnNumber);
// swig.setFilter('getBrand', util.getBrand);
// swig.setFilter('fixMainCategoryName', util.fixMainCategoryName);
// swig.setFilter('number_format', util.formatNumber);
// swig.setFilter('formatNumber', util.formatNumber);
// swig.setFilter('nl2br', util.nl2br);
// swig.setFilter('dot2li', util.dot2li);
// swig.setFilter('arrayLength', util.arrayLength);
// swig.setFilter('epoch', util.epoch);
// swig.setFilter('epochToDate', util.epochToDate);
// swig.setFilter('parseToDate', util.parseToDate);
// swig.setFilter('ffeTimestamp', util.ffeTimestamp);
// swig.setFilter('getWeightInGrams', util.getWeightInGrams);
// swig.setFilter('cleanInteger', util.cleanInteger);
// swig.setFilter('htmlIdSafe', util.htmlIdSafe);
// swig.setFilter('escapeEmail', util.escapeEmail);
// swig.setFilter('csvSafe', util.csvSafe);
// swig.setFilter('cleanString', util.cleanString);
//
// swig.setFilter('hasImage', util.hasImage);
// swig.setFilter('hasProductImage', util.hasProductImage);
// swig.setFilter('hasCategoryImage', util.hasCategoryImage);
// swig.setFilter('hasCategoryIntermediateImage', util.hasCategoryIntermediateImage);
// swig.setFilter('hasCategorySubImage', util.hasCategorySubImage);
// swig.setFilter('getProductImageSrc', util.getProductImageSrc);
// swig.setFilter('makeProductImageSrcFromId', util.makeProductImageSrcFromId);
//
// swig.setFilter('calculateDiscount', util.calculateDiscount);
// swig.setFilter('highlightSearch', util.highlightSearch);
//
// swig.setFilter('replaceInlineContent', util.replaceInlineContent);
// swig.setFilter('productIsFavorite', util.productIsFavorite);
// swig.setFilter('repairStatus', util.repairStatus);
// swig.setFilter('match', util.matchThis);
// swig.setFilter('ucFirst', util.ucFirst);
// swig.setFilter('replaceLinks', util.replaceLinks);
// swig.setFilter('padDayMonth', util.padDayMonth);
// swig.setFilter('coalesce', util.coalesce);
// swig.setFilter('isObject', util.isObject);
//
// const nobreaks = require('./swig-extensions/nobreaks-tag.js');
//
// swig.setTag('nobreaks', nobreaks.parse, nobreaks.compile, nobreaks.ends, nobreaks.blockLevel);

module.exports = swig;
