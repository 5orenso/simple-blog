/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */

'use strict';

const _ = require('underscore');
const strftime = require('strftime');
const marked = require('marked');
const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');
const moment = require('moment');

const appPath = `${__dirname}/../`;
const renderer = new marked.Renderer();
const myPlugins = [];
const myReplacers = [];

function loadPlugins(opt) {
    const stat = fs.lstatSync(opt.path);
    if (stat.isDirectory()) {
        fs.readdirSync(opt.path).forEach((file) => {
            if (file.match(/\.js$/)) {
                try {
                    console.log('+ plugin is enabled: ', file);
                    // eslint-disable-next-line
                    const Plugin = require(opt.path + file);
                    const plugin = new Plugin();
                    myPlugins.push(plugin);
                } catch (err) {
                    console.error('! plugin crashed on require:', file, err);
                }
            }
        });
    }
}

function loadReplacers(opt) {
    const stat = fs.lstatSync(opt.path);
    if (stat.isDirectory()) {
        fs.readdirSync(opt.path).forEach((file) => {
            if (file.match(/\.js$/)) {
                try {
                    console.log('+ replacer is enabled: ', file);
                    // eslint-disable-next-line
                    const Replacer = require(opt.path + file);
                    const replacer = new Replacer();
                    myReplacers.push(replacer);
                } catch (err) {
                    console.error('! replacer crashed on require:', file, err);
                }
            }
        });
    }
}

function returnString($obj, ...$args) {
    let args = $args;
    if (Array.isArray(args[0])) {
        args = args[0];
    }
    // let args = Array.prototype.slice.call(arguments, 1);
    let obj = $obj;
    for (let i = 0; i < args.length; i += 1) {
        if (!obj || !obj.hasOwnProperty(args[i])) {
            return false;
        }
        obj = obj[args[i]];
    }
    if (Array.isArray(obj)) {
        return marked(obj.map(o => `* ${o}`).join('\n'), { renderer });
    }
    return obj;
}

loadPlugins({
    path: path.normalize(`${appPath}lib/plugins/`),
});
loadReplacers({
    path: path.normalize(`${appPath}lib/replacers/`),
});

// Markdown setup.
marked.setOptions({
    highlight(code) {
        // eslint-disable-next-line
        return require('highlight.js').highlightAuto(code).value;
    },
});
renderer.heading = function heading(text, level) {
    const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
    return `<h${level} class="toc-${level}"><a name="${
        escapedText
    }" class="anchor" href="#${
        escapedText
    }"><span class="header-link"></span></a>${
        text}</h${level}>`;
};
// <a href="#" id="pop">
//     <img id="imageresource" src="http://patyshibuya.com.br/wp-content/uploads/2014/04/04.jpg"
//         style="width: 400px; height: 264px;">
//     Click to Enlarge
// </a>
renderer.image = function image($href, title, text) {
    const src = $href;
    const href = $href.replace(/(w=[0-9]+)/, 'w=1800');
    const mediaClass = [];
    const result = src.match(/#([a-z,]+)$/);
    if (result) {
        const allClasses = result[1].split(',');
        for (let i = 0, l = allClasses.length; i < l; i += 1) {
            mediaClass.push(allClasses[i]);
        }
    }
    return `<p class="image_inline ${mediaClass.join(' ')}"><a href="${href}" data-smoothzoom="group1" title="${title
        || text}"><img src="${src}" alt="${text}" title="${title || text}" class="img-fluid">` +
        `</a><span class="image_inline_text">${title || text}</span></p>`;
};

function ArticleUtil(options) {
    this.opts = options || {};
    this.logger = this.opts.logger;
}

ArticleUtil.prototype.replaceMarked = function replaceMarked(input) {
    return marked(input, { renderer });
};

ArticleUtil.prototype.fixFilename = function fixFilename(filename) {
    return filename.replace(/^_/, '');
};

ArticleUtil.prototype.removeLineBreaks = function removeLineBreaks(content) {
    return content.replace(/(\n|\r)+/g, ' ');
};

ArticleUtil.prototype.substring = function substring(input, start, end) {
    return input.substring(start, end);
};

ArticleUtil.prototype.cleanHtml = function cleanHtml($input) {
    const input = $input.replace(/<(h[1-9]).+?>.+?<\/\1>/gi, '');
    return input.replace(/<.+?>/g, ' ');
};

ArticleUtil.prototype.inlineImageSize = function inlineImageSize($input, $size) {
    const input = $input.replace(/(<img.+?)\?w=[0-9]+/gi, `$1?w=${$size}`);
    // const input = $input;
    return input;
};

ArticleUtil.prototype.oneline = function oneline(name) {
    let str = name;
    str = str.replace(/\r+/g, ' ');
    str = str.replace(/\n+/g, ' ');
    str = str.replace(/\t+/g, ' ');
    str = str.replace(/\s+/g, ' ');
    str = str.replace(/^\s+/, '');
    str = str.replace(/\s+$/, '');
    return str;
};

ArticleUtil.prototype.duration = function duration(input) {
    return moment.duration(input);
};

ArticleUtil.prototype.match = function match($string, $match) {
    const regexp = new RegExp($match);
    return $string.match(regexp);
};

ArticleUtil.prototype.formatDate = function formatDate($isoDate) {
    const isoDate = $isoDate || strftime('%Y-%m-%d');
    let format = '%b %e';
    const currentYear = strftime('%Y');
    const thisYear = strftime('%Y', new Date(Date.parse(isoDate)));
    if (currentYear > thisYear) {
        format = '%b %e, %Y';
    }
    return strftime(format, new Date(Date.parse(isoDate)));
};

ArticleUtil.prototype.rssDate = function rssDate($isoDate) {
    const isoDate = $isoDate || strftime('%Y-%m-%d %H:%M:%S');
    const newDate = new Date(Date.parse(isoDate));
    return newDate.toUTCString();
};

ArticleUtil.prototype.getArticleFilename = function getArticleFilename(completeFilename) {
    let filename;
    if (_.isString(completeFilename)) {
        filename = completeFilename.replace(/^.*\//, '');
        filename = filename.replace(/\?.*$/, '');
    }
    return filename === '' ? 'index' : filename;
};

ArticleUtil.prototype.getArticlePathRelative = function getArticlePathRelative(completePath, $contentPath) {
    let contentPath = $contentPath;
    if (!_.isString(contentPath)) {
        contentPath = '';
    }
    if (_.isString(completePath)) {
        contentPath = path.normalize(contentPath);
        let relativePath = completePath;
        if (_.isString(relativePath)) {
            const re = new RegExp(contentPath, 'i');
            relativePath = relativePath.replace(re, '');

            // Remove filename
            relativePath = relativePath.replace(/(\/*[^/]+$)/, '');
            relativePath = relativePath.replace(/\/+/g, '/');

            if (!relativePath.match(/^\//)) {
                relativePath = `/${relativePath}`;
            }
            if (!relativePath.match(/\/$/)) {
                relativePath += '/';
            }
        }
        return relativePath || '/';
    }
    return null;
};

ArticleUtil.prototype.getUrlFromRequest = function getUrlFromRequest(req) {
    if (_.isObject(req)) {
        if (_.isString(req.url)) {
            let articleFilename = req.url;
            articleFilename = decodeURIComponent(articleFilename);
            articleFilename = articleFilename.replace(/\.html/, '');
            if (articleFilename.match(/\/$/)) {
                articleFilename += 'index';
            }
            return articleFilename;
        }
    }
    return undefined;
};

ArticleUtil.prototype.populateArticleSections = function populateArticleSections($data) {
    if (!$data) {
        return {};
    }
    // Check for YAML header
    let yamlObj = {};
    let data = $data.replace(/^---([\s\S]+?)---/, (match, p1) => {
        if (p1) {
            try {
                yamlObj = yaml.safeLoad(p1);
            } catch (e) {
                console.log(e);
            }
        }
        return '';
    });
    let jsonObj = {};
    data = data.replace(/^```json([\s\S]+?)```/, (match, p1) => {
        if (p1) {
            try {
                jsonObj = JSON.parse(p1);
                const parseObjects = ['recipe'];
                const durationFields = ['prepTime', 'cookTime'];
                for (let i = 0, l = parseObjects.length; i < l; i += 1) {
                    const obj = parseObjects[i];
                    if (typeof jsonObj[obj] === 'object') {
                        for (let j = 0, m = durationFields.length; j < m; j += 1) {
                            const field = durationFields[j];
                            if (typeof jsonObj[obj][field] === 'string') {
                                jsonObj[obj][`${field}Min`] = moment.duration(jsonObj[obj][field]).asMinutes();
                            }
                        }
                    }
                }
            } catch (e) {
                console.log(e);
            }
        }
        return '';
    });

    // Split content into sections.
    // jscs:disable
    const dataLines = data.split('\n');
    // jscs:enable
    let mode = 'body';
    let lastMode;
    const article = Object.assign({
        tagValues: {
            toc: '',
            fact: '',
            artlist: '',
        },
    }, yamlObj, jsonObj);
    function replacerSections(match, p1, p2, p3) {
        if (_.isString(p2)) {
            lastMode = mode;
            mode = p2;
        }
        return p3;
    }
    const colNumber = {};
    for (let i = 0, l = dataLines.length; i < l; i += 1) {
        if (_.isString(dataLines[i])) {
            let lineContainsMode = false;
            // var line_mode_equals_last_mode = false;
            if (dataLines[i].match(/(^:([a-zA-Z0-9-]+)\s*)(.*)$/)) {
                lineContainsMode = true;
            }
            const dataLine = dataLines[i].replace(/(^:([a-zA-Z0-9-]+)\s*)(.*)$/, replacerSections);
            if (_.isString(article[mode]) && article[mode].length > 0) {
                if (mode.match(/^(title|teaser)$/)) {
                    mode = lastMode;
                } else {
                    // jscs:disable
                    article[mode] += `\n${dataLine}`;
                    // jscs:enable
                }
            } else if (mode.match(/^(col|col\d+)$/)) {
                if (!_.isArray(article[mode])) {
                    article[mode] = [];
                }
                if (lineContainsMode) {
                    if (_.isUndefined(colNumber[mode])) {
                        colNumber[mode] = 0;
                    } else {
                        colNumber[mode] += 1;
                    }
                }
                if (_.isEmpty(article[mode][colNumber[mode]])) {
                    article[mode][colNumber[mode]] = dataLine;
                } else {
                    // jscs:disable
                    article[mode][colNumber[mode]] += `\n${dataLine}`;
                    // jscs:enable
                }
            } else if (mode.match(/^(img|imgtext|img2|img3|img4|img5|img6|img7|img8|img9|tag|images)$/)) {
                // Push all values into an array.
                if (!_.isArray(article[mode])) {
                    article[mode] = [];
                }
                if (!_.isArray(article[`${mode}Text`])) {
                    article[`${mode}Text`] = [];
                }
                if (mode.match(/img/)) {
                    const dataArray = dataLine.split(/#/);
                    article[mode].push(dataArray[0]);
                    article[`${mode}Text`].push(dataArray[1]);
                } else {
                    article[mode].push(dataLine);
                }
                // Switch back to the previous mode.
                mode = lastMode;
            } else {
                article[mode] = dataLine;
            }
        }
    }

    // Do we have a title section? If not chop the first line of the body
    if (_.isEmpty(article.title)) {
        // jscs:disable
        const bodyLines = article.body.split('\n');
        // jscs:enable
        article.title = bodyLines[0];
    }

    return article;
};

ArticleUtil.prototype.buildTableOfContents = function buildTableOfContents($article, field) {
    const article = $article;
    function replacerHeadlines(match, p1, p2, p3, p4, p5) {
        const tocHeadline = `<a href="${p4}">${p5}</a>`;
        const indentLevel = p2;
        return `<span class="toc-indent-${indentLevel}">&bull; ${tocHeadline}</span>`;
    }
    // Find all headlines and generate toc.
    if (_.isObject(article) && _.isString(article[field])) {
        const tocArray = article[field].match(/(<h([1-9]) class="toc-\2">.+?<\/h\2>)/g) || [];
        if (tocArray.length > 0) {
            article.tagValues.toc = '<div class="toc" id="toc">';
            for (let i = 0, l = tocArray.length; i < l; i += 1) {
                if (tocArray[i]) {
                    let headline = tocArray[i];
                    // jscs:disable
                    // eslint-disable-next-line
                    headline = headline.replace(/(<h([1-9]) class="toc-\2"><a name="(.+?)" class="anchor" href="(#.+?)"><span class="header-link"><\/span><\/a>(.+?)<\/h\2>)/g, replacerHeadlines);
                    // jscs:enable
                    article.tagValues.toc += headline;
                }
            }
            article.tagValues.toc += '</div>';
        }
    }
};

ArticleUtil.prototype.formatArticleSections = function formatArticleSections($article) {
    const article = $article;
    const articleKeys = Object.keys(article);
    for (let i = 0, l = articleKeys.length; i < l; i += 1) {
        const section = articleKeys[i];
        if (_.isString(article[section])) {
            if (typeof article[`${section}Raw`] === 'undefined') {
                article[`${section}Raw`] = article[section];
            }
            if (section.match(/^(title|author|published)/)) {
                // Remove trailing new lines.
                article[section] = article[section].replace(/(\n|\r)+$/, '');
            } else if (section.match(/^(body|aside|ingress|teaser|footnote|col|youtube)/)) {
                // Parse markdown to html
                for (let i3 = 0, l3 = myPlugins.length; i3 < l3; i3 += 1) {
                    if (_.isObject(myPlugins[i3])) {
                        const plugin = myPlugins[i3];
                        article[section] = article[section].replace(plugin.get('regexp'), plugin.replacer);
                    }
                }
                article[section] = this.replaceMarked(article[section]);
                this.buildTableOfContents(article, section);
            } else {
                // Parse markdown to html
                article[section] = article[section].replace(/(\n|\r)+$/, '');
            }
        } else if (_.isArray(article[section])) {
            if (section.match(/^(body|aside|ingress|teaser|footnote|col|youtube)/)) {
                const articleSectionKeys = Object.keys(article[section]);
                for (let i2 = 0, l2 = articleSectionKeys.length; i2 < l2; i2 += 1) {
                    const key = articleSectionKeys[i2];
                    if (_.isString(article[section][key])) {
                        // Parse markdown to html
                        for (let i3 = 0, l3 = myPlugins.length; i3 < l3; i3 += 1) {
                            if (_.isObject(myPlugins[i3])) {
                                const plugin = myPlugins[i3];
                                article[section][key] =
                                    article[section][key].replace(plugin.get('regexp'), plugin.replacer);
                            }
                        }
                        article[section][key] = this.replaceMarked(article[section][key]);
                        this.buildTableOfContents(article, section);
                    }
                }
            }
        }
    }
};

ArticleUtil.prototype.replaceTagsWithContent = function replaceTagsWithContent($article) {
    const article = $article;
    const logger = this.logger;
    function replacerTags(match, p1, p2) {
        // console.log('replacerTags', match, p1, p2);
        if (logger) {
            logger.log(`replaceTagsWithContent->replacerTags->p1: ${p1}`);
        }
        if (p1.match(/^fa-/)) {
            let result = `<span class="fa ${p1}"></span>`;
            if (!_.isUndefined(p2)) {
                const count = parseInt(p2.trim(), 10);
                if (_.isNumber(count)) {
                    result = new Array(count + 1).join(result);
                }
            }
            return result;
        }
        return article.tagValues[p1] || returnString(article, p1.split('.')) || '';
    }

    // Insert tag into sections.
    // TODO: Do not replace tags inside code blocks.
    const fields = ['toc', 'body', 'aside', 'col', 'footnote'];
    for (let i = 0, l = fields.length; i < l; i += 1) {
        if (fields[i]) {
            const field = fields[i];
            for (let j = 0; j < 10; j += 1) {
                let replaceField = field;
                if (j > 0) {
                    replaceField = field + j;
                }
                if (_.isString(article[replaceField])) {
                    const myReplacersKeys = Object.keys(myReplacers);
                    for (let i2 = 0, l2 = myReplacersKeys.length; i2 < l2; i2 += 1) {
                        const m = myReplacersKeys[i2];
                        if (_.isObject(myReplacers[m])) {
                            const replacer = myReplacers[m];
                            article[field] = article[field].replace(replacer.get('regexp'), replacer.replacer);
                        }
                    }
                    const reg = /\[:([a-z_\-0-9.]+)(\s[a-z_\-0-9]+)*?\]/gi;
                    article[replaceField] = article[replaceField].replace(reg, replacerTags);
                } else if (_.isArray(article[replaceField])) {
                    const replaceFieldKeys = Object.keys(article[replaceField]);
                    for (let i2 = 0, l2 = replaceFieldKeys.length; i2 < l2; i2 += 1) {
                        const k = article[replaceField][i2];
                        if (_.isString(article[replaceField][k])) {
                            const myReplacersKeys = Object.keys(myReplacers);
                            for (let i3 = 0, l3 = myReplacersKeys.length; i3 < l3; i3 += 1) {
                                const n = myReplacersKeys[i3];
                                if (_.isObject(myReplacers[n])) {
                                    const replacer = myReplacers[n];
                                    article[replaceField][k] =
                                        article[replaceField][k].replace(replacer.get('regexp'), replacer.replacer);
                                }
                            }
                            const reg = /\[:([a-z_\-0-9]+)(\s[a-z_\-0-9]+)*?\]/g;
                            article[replaceField][k] = article[replaceField][k].replace(reg, replacerTags);
                            // article[replaceField][k].replace(/\[:([a-z_\-0-9]+)(\s[a-z_\-0-9]+)*?\]/g, replacerTags);
                        }
                    }
                } else if (_.isString(article.tagValues[replaceField])) {
                    const reg = /\[:([a-z_\-0-9]+)(\s[a-z_\-0-9]+)*?\]/gm;
                    article.tagValues[replaceField] = article.tagValues[replaceField].replace(reg, replacerTags);
                    // article.tagValues[replaceField].replace(/\[:([a-z_\-0-9]+)(\s[a-z_\-0-9]+)*?\]/gm, replacerTags);
                }
            }
        }
    }
};

ArticleUtil.prototype.formatArtlist = function formatArtlist($article, artlist) {
    const article = $article;
    if (!_.isObject(article.tagValues)) {
        article.tagValues = {};
    }
    article.artlist = artlist || {};
    article.tagValues.artlist = '<ul class="artlist">';
    article.tagValues['artlist-block'] = '<div class="artlist">';
    article.tagValues.artlistOnepage = '<ul class="artlist">';
    if (_.isObject(artlist)) {
        for (let i = 0, l = artlist.length; i < l; i += 1) {
            if (artlist[i]) {
                const art = artlist[i];
                article.tagValues.artlist += `<li><a href="${path.normalize(art.baseHref + art.file)}">${
                    art.title}</a></li>`;
                article.tagValues['artlist-block'] += `${'<div class="artlist-art">' +
                    '<div class="artlist-image" style="'}${_.isArray(art.img) ? `${'background-image: ' +
                    'url(\'/pho/'}${art.img[0]}?w=500');` : ''
                }"><a href="${path.normalize(art.baseHref + art.file)}"><img src="/images/pix.gif" ` +
                    'style="height:100%; width:100%;"></a></div>' +
                    `<h3><a href="${art.baseHref}${art.file}">${art.title}</a></h3>` +
                    '</div>';
                article.tagValues.artlistOnepage += `<li><a href="#${path.normalize(art.baseHref + art.file)
                }">${art.title}</a></li>`;
            }
        }
    }
    article.tagValues.artlist += '</ul>';
    article.tagValues['artlist-block'] += '</div><br class="clear">';
    article.tagValues.artlistOnepage += '</ul>';
};

ArticleUtil.prototype.formatArtAlllist = function formatArtAlllist($article, artlistall) {
    const article = $article;
    if (!_.isObject(article.tagValues)) {
        article.tagValues = {};
    }
    article.artlistall = artlistall || {};
    article.tagValues.artlistall = '<ul class="artlistall">';
    article.tagValues['artlistall-block'] = '<div class="artlistall">';
    article.tagValues.artlistallOnepage = '<ul class="artlistall">';
    if (_.isObject(artlistall)) {
        for (let i = 0, l = artlistall; i < l; i += 1) {
            if (artlistall[i]) {
                const art = artlistall[i];
                article.tagValues.artlistall += `<li><a href="${path.normalize(art.baseHref + art.file)}">${
                    art.title}</a></li>`;
                article.tagValues['artlistall-block'] += `${'<div class="artlistall-art">' +
                    '<div class="artlistall-image" style="'}${_.isArray(art.img) ? `${'background-image: ' +
                    'url(\'/pho/'}${art.img[0]}?w=500');` : ''
                }"><a href="${path.normalize(art.baseHref + art.file)}"><img src="/images/pix.gif" ` +
                    'style="height:100%; width:100%;"></a></div>' +
                    `<h3><a href="${art.baseHref}${art.file}">${art.title}</a></h3>` +
                    '</div>';
                article.tagValues.artlistallOnepage += `<li><a href="#${path.normalize(art.baseHref + art.file)
                }">${art.title}</a></li>`;
            }
        }
    }
    article.tagValues.artlistall += '</ul>';
    article.tagValues['artlistall-block'] += '</div><br class="clear">';
    article.tagValues.artlistallOnepage += '</ul>';
};

module.exports = ArticleUtil;
