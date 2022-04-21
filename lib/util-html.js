'use strict';

const path = require('path');
const swig = require('swig');
const marked = require('marked');
const fs = require('fs');
const util = require('./utilities');

const appPath = path.normalize(`${__dirname}/../`);
const templatePath = `${appPath}template/current`;

const highlight = function highlight(code) {
    // eslint-disable-next-line
    return require('highlight.js').highlightAuto(code).value;
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// IMPORTANT: renderer is overwritten inside node-simple-utilities
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

const renderer = new marked.Renderer();

// Markdown setup.
marked.setOptions({
    renderer,
    highlight,
    pedantic: false,
    gfm: true,
    tables: true,
    breaks: true,
    sanitize: false,
    smartLists: true,
    smartypants: true,
    xhtml: false,
});

renderer.heading = (text, level) => {
    const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
    return `<h${level} class="toc-${level}" data-toc='{ "level": ${level}, "title": "${text}", "anchor": "${escapedText}" }'><a name="${
        escapedText
    }" class="anchor" href="#${
        escapedText
    }"><span class="header-link"></span></a>${
        text}</h${level}>`;
};

renderer.table = (header, body) => (
    `<table class="table table-striped">
        ${header}
        ${body}
    </table>`
);

renderer.tablecell = (content, flags) => (
    `<t${flags.header ? 'h' : 'd'} class="text-${Number.isNaN(content) ? '' : 'right'}">
        ${content}
    </td>`
);

renderer.paragraph = (text) => {
    const regex = new RegExp('^<(a|img|div)', 'i');
    if (regex.test(text)) {
        return `${text}\n`;
    }
    return `<p>${text}</p>\n`;
};

renderer.image = ($href, title, text) => {
    if ($href.match(/youtube.com/)) {
        const regexp = /(^|[\s\t\n]+)https*:\/\/(www\.)*youtube\.com\/(.*?v=([^&\s]+)(&[^\s]+)*)/gi;
        const youtubeVideo = $href.replace(regexp, (match, p0, p1, p2, p3) => {
            return p3;
        });
        return `
            <div class="embed-responsive embed-responsive-16by9">
                <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/${youtubeVideo}?rel=0" allowfullscreen></iframe>
            </div>
            <div class="image_inline_text"><strong>${text || ''}</strong> ${title || ''}</div>
        `;
    }
    const src = $href;
    const href = $href.replace(/(w=[0-9]+)/, 'w=1920');
    const mediaClass = [];
    const result = src.match(/#([a-z0-9,-]+)$/i);
    if (result) {
        const allClasses = result[1].split(',');
        if (allClasses[0] === 'card') {
            return `
                <div class="card float-right col-lg-4 col-md-6 col-sm-12 p-0 ml-2 mb-2 mt-2 ${allClasses.join(' ')}">
                    <img class="card-img-top" src="${src}" alt="${title || text}">
                    <div class="card-body">
                        <h5 class="card-title">${text || ''}</h5>
                        <p class="card-text">${title || ''}</p>
                    </div>
                </div>`;
        }
        if (allClasses[0] === 'card2') {
            return `
                <div class="float-right card col-lg-7 col-md-7 col-sm-12 p-0 ml-2 mb-2 mt-2 ${allClasses.join(' ')}">
                    <div class="row no-gutters">
                        <div class="col-md-4">
                            <img class="card-img img-fluid" src="${src}" alt="${title || text}">
                        </div>
                        <div class="col-md-8">
                            <div class="card-body">
                                <h5 class="card-title">${text || ''}</h5>
                                <p class="card-text">${title || ''}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
        if (allClasses[0] === 'nolink') {
            return `
                 <p class="${allClasses.join(' ')}">
                    <img src="${src}" alt="${title || text}" title="${title || text}" class="img-fluid">
                    <div class="image_inline_text"><strong>${text || ''}</strong> ${title || ''}</div>
                </p>
            `;
        }
        if (allClasses[0] === 'plain') {
            return `
                <div class='d-flex justify-content-center ${allClasses.join(' ')}'>
                    <img src="${src}" alt="${title || text}" title="${title || text}" class="img-fluid">
                </div>
            `;
        }
        if (allClasses[0] === 'circle') {
            return `
                <div class='text-center border rounded-circle imageRounded text-muted pt-2 ${allClasses.join(' ')}' style='background-image: url("${src}"); background-size: cover;'>
                    &nbsp;
                </div>
            `;
        }
        if (allClasses[0] === 'circleXL') {
            return `
                <div class='text-center border rounded-circle imageRounded imageRoundedXLarge text-muted pt-2 ${allClasses.join(' ')}' style='background-image: url("${src}"); background-size: cover;'>
                    &nbsp;
                </div>
            `;
        }
        if (allClasses[0] === 'circleL') {
            return `
                <div class='text-center border rounded-circle imageRounded imageRoundedLarge text-muted pt-2 ${allClasses.join(' ')}' style='background-image: url("${src}"); background-size: cover;'>
                    &nbsp;
                </div>
            `;
        }
        if (allClasses[0] === 'circleM') {
            return `
                <div class='text-center border rounded-circle imageRounded imageRoundedMedium text-muted pt-2 ${allClasses.join(' ')}' style='background-image: url("${src}"); background-size: cover;'>
                    &nbsp;
                </div>
            `;
        }
        if (allClasses[0] === 'circleS') {
            return `
                <div class='text-center border rounded-circle imageRounded imageRoundedSmall text-muted pt-2 ${allClasses.join(' ')}' style='background-image: url("${src}"); background-size: cover;'>
                    &nbsp;
                </div>
            `;
        }
        if (allClasses[0] === 'fullwidth') {
            return `
                        </div>
                    </div>
                </div>
            </div>
            <div class='container-fluid'>
                <div class='row d-flex justify-content-center ${allClasses.join(' ')}'>
                    <img src="${src}" alt="${title || text}" title="${title || text}" class="img-fluid">
                    <div class="image_inline_text col"><strong>${text || ''}</strong> ${title || ''}</div>
                </div>
            </div>
            <div class="container">
                <div class="row">
                    <div class="col-lg-8 blog-main">
                        <div class="blog-post">
            `;
        }
        for (let i = 0, l = allClasses.length; i < l; i += 1) {
            mediaClass.push(allClasses[i]);
        }
    }
    return `
        <p class="image_inline ${mediaClass.join(' ')}">
            <a href="${href}" data-smoothzoom="group1" title="${title || text}">
                <img src="${src}" alt="${title || text}" title="${title || text}" class="img-fluid">
            </a>
            <div class="image_inline_text"><strong>${text || ''}</strong> ${title || ''}</div>
        </p>
    `;
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const myPlugins = [];

function loadPlugins(opt) {
    const stat = fs.lstatSync(opt.path);
    if (stat.isDirectory()) {
        fs.readdirSync(opt.path).forEach((file) => {
            if (file.match(/\.js$/)) {
                try {
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

loadPlugins({ path: path.normalize(`${appPath}lib/plugins/`) });

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function htmlUtilities() {
    function fixImageLinksWhiteSpace(input) {
        function replacerImageWhiteSpace(match, p1, p2, p3) {
            const imageSrc = p2.replace(/ /g, '%20');
            const result = `![${p1}](${imageSrc}${p3})`;
            return result;
        }
        const reg = /!\[(.+?)\]\((.+?\.[a-z]{3,4})(.*?)\)/gi;
        return input.replace(reg, replacerImageWhiteSpace);
    }

    function replaceMarked(input, noPTag) {
        if (typeof input === 'string') {
            const fixedInput = fixImageLinksWhiteSpace(input);
            let parsedMarkdown = marked(fixedInput);
            // Get all toc-data
            const tocRegexp = new RegExp(/<h.+?data-toc='(.+?)'.*?>/, 'g');
            const tocLineRegexp = new RegExp(/<h.+?data-toc='(.+?)'.*?>/);
            const results = parsedMarkdown.match(tocRegexp);
            const tocHtml = [];
            if (results && results.length > 0) {
                const tocList = [];
                for (let i = 0, l = results.length; i < l; i += 1) {
                    const line = results[i];
                    const lineResults = line.match(tocLineRegexp);
                    const tocJSON = lineResults[1]; //.replace(/\\"/g, '"');
                    try {
                        const tocData = JSON.parse(tocJSON);
                        tocList.push(tocData);
                    } catch (err) {
                        console.log(tocJSON);
                        console.log(err);
                    }
                }
                let prevLevel = 1;
                tocHtml.push('<ul class="toc-main list-unstyled">');
                for (let i = 0, l = tocList.length; i < l; i += 1) {
                    const obj = tocList[i];
                    if (obj.level > prevLevel) {
                        for (let j = prevLevel + 1, m = obj.level; j <= m; j += 1) {
                            tocHtml.push(`<ul class="toc-level-${j} list-unstyled ml-4">`);
                        }
                    }
                    if (obj.level < prevLevel) {
                        for (let j = obj.level, m = prevLevel; j <= m; j += 1) {
                            tocHtml.push('</ul>');
                        }
                        tocHtml.push(`<ul class="toc-level-${obj.level} list-unstyled ml-4">`);
                    }
                    tocHtml.push(`<li class="toc-level-${obj.level}-item"><a href="#${obj.anchor}">${obj.title}</a></li>`);
                    prevLevel = obj.level;
                }
                for (let i = 0, l = prevLevel; i < l; i += 1) {
                    tocHtml.push('</ul>');
                }
            }
            // parsedMarkdown = parsedMarkdown.replace(/<!--toc-->/, `<xmp>${JSON.stringify(tocHtml, null, 4)}</xmp> ${tocHtml.join('\n')}`);
            parsedMarkdown = parsedMarkdown.replace(/<!--toc-->/, `<div class='toc-container mb-4'>${tocHtml.join('\n')}</div>`);
            if (noPTag) {
                parsedMarkdown = parsedMarkdown.replace(/^<p>(.+)<\/p>/i, '$1');
            }
            return parsedMarkdown;
        }
        return input;
    }

    function inlineImageSize($input, $size) {
        const input = $input.replace(/(<img.+?)\?w=[0-9]+/gi, `$1?w=${$size}`);
        return input;
    }

    function replaceBBTags(content = '', article = {}, config) {
        if (typeof content !== 'string') {
            return content;
        }
        function replacer(match, p1, p2, p3) {
            // p1 = tag
            // p2 = params
            // p3 = content
            const tag = p1.toLowerCase();
            const params = p2.split(' ');
            const opts = {};
            const content = p3.trim();
            const contentLines = content.split('\n');
            params.forEach((e) => {
                const param = e.split('=');
                if (param[0] && param[1]) {
                    opts[param[0]] = param[1].replace(/;/g, ' ');
                }
            });
            if (!opts.articleId) {
                opts.articleId = article.id;
            }
            if (['poll', 'booking', 'clock', 'form', 'gallery', 'map', 'racetracker', 'rating', 'related', 'sheet', 'weather'].includes(tag)) {
                const replacerResult = `<div class='w-100 ${opts.containerClasses || 'my-3'} clearfix' data-widget-host="simple-blog-${tag}">
<script type="text/props">
    {
        "apiServer": "${config.blog.protocol}://${config.blog.domain}",
        "content": "${content}",
${Object.keys(opts).map(key => `        "${key}": "${opts[key]}"`).join(',\n')}
    }
</script>
</div>
<script async src="/preact/simple-blog-${tag}/bundle.js?time=${new Date().getTime()}"></script>
                `;
                return replacerResult;
            }
            if (['left'].includes(tag)) {
                return `<div class='row my-4'><div class='col-xl-4 col-lg-5 col-md-6 col-sm-12'>
${contentLines[0]}
</div><div class='col-xl-8 col-lg-7 col-md-6 col-sm-12'>
${contentLines.slice(1).join('\n')}
</div></div>`;
            }
            if (['right'].includes(tag)) {
                return `<div class='row my-4'><div class='col-xl-8 col-lg-7 col-md-6 col-sm-12'>
${contentLines.slice(1).join('\n')}
</div><div class='col-xl-4 col-lg-5 col-md-6 col-sm-12'>
${contentLines[0]}
</div></div>`;
            }
        }
        const reg = /\[([a-z]+)(.*?)\](.*(?=\[\/\1\]))\[\/\1\]/gs;
        const finalResult = content.replace(reg, replacer);
        return finalResult;
    }

    function replaceContentTags(content = '', article = {}, config) {
        if (typeof content !== 'string') {
            return content;
        }
        function replacer(match, p1) {
            const parts = p1.split(' ');
            parts.shift();
            const opts = {};
            parts.forEach((e) => {
                const param = e.split('=');
                opts[param[0]] = param[1].replace(/;/g, ' ');
            });
            if (!opts.articleId) {
                opts.articleId = article.id;
            }

            const replacerResult = `<div class='w-100 ${opts.containerClasses || 'my-3'} clearfix' data-widget-host="simple-blog-${opts.name}">
<script type="text/props">
    {
        "apiServer": "${config.blog.protocol}://${config.blog.domain}",
${Object.keys(opts).map(key => `        "${key}": "${opts[key]}"`).join(',\n')}
    }
</script>
</div>
<script async src="/preact/simple-blog-${opts.name}/bundle.js?time=${new Date().getTime()}"></script>
            `;
            return replacerResult;
        }

        const reg = /\{\{([a-zA-ZæøåÆØÅ0-9 ,=;:_./-]+)\}\}/g;
        const finalResult = content.replace(reg, replacer);
        return finalResult;
    }

    function replaceDataTags($content, article) {
        if (typeof $content !== 'string') {
            return $content;
        }
        let content = $content;
        function replacerTags(match, $p1, $p2) {
            const p1 = $p1.replace(/\+/g, ' ');
            // console.log('replacerTags', match, p1, p2);
            if (p1.match(/^fa-/)) {
                let result = `<span class="fa ${p1}"></span>`;
                if (typeof p2 !== 'undefined') {
                    const count = parseInt(p2.trim(), 10);
                    if (typeof count === 'number') {
                        result = new Array(count + 1).join(result);
                    }
                }
                return result;
            } else if (typeof $p2 !== 'undefined') {
                const p2 = $p2.replace(/\+/g, ' ');
                const command = p2.trim();
                let result = util.getString(article, p1.split('.')) || '';
                if (command === 'size') {
                    result = util.formatBytes(result, 2);
                } else if (command === 'date') {
                    result = util.isoDateNormalized(result);
                } else if (command === 'dim') {
                    result = util.formatDim(result);
                } else if (command === 'position') {
                    result = util.formatPosition(result);
                }

                return result;
            }
            return util.getString(article, p1.split('.')) || '';
        }

        const reg = /\[:([a-z_\-0-9.+]+)(\s[a-z_\-0-9.+]+)*?\]/gi;
        content = content.replace(reg, replacerTags);
        return content;
    }

    function replaceAt(string, index, replace) {
        return string.substring(0, index) + replace + string.substring(index + 1);
    }

    function dropFirstLetter($string) {
        let mode = 0;
        for (let i = 0, l = $string.length; i < l; i += 1) {
            const letter = $string.charAt(i);
            if (letter === '<') {
                mode = 1;
            } else if (letter === '>') {
                mode = 0;
            }
            if (mode === 0 && letter.match(/\w/)) {
                return replaceAt($string, i, `<span class="blog-drop-letter">${letter}</span>`);
            }
        }
        return $string;
    }

    function dropFirstLetterAfterHr($string) {
        const stringParts = $string.split('<hr>');
        for (let i = 0, l = stringParts.length; i < l; i += 1) {
            stringParts[i] = dropFirstLetter(stringParts[i]);
        }
        return stringParts.join('<hr>');
    }

    function runPlugins(content) {
        const fields = ['body', 'aside', 'ingress', 'teaser', 'footnote', 'col', 'youtube'];
        for (let i = 0, l = fields.length; i < l; i += 1) {
            const field = fields[i];
            if (content && typeof content[field] === 'string') {
                for (let j = 0, m = myPlugins.length; j < m; j += 1) {
                    if (typeof myPlugins[j] === 'object') {
                        const plugin = myPlugins[j];
                        // eslint-disable-next-line
                        content[`${field}Raw`] = content[field];
                        content[field] = content[field].replace(plugin.get('regexp'), plugin.replacer);

                    }
                }
            }
        }
    }

    function renderPage(req, res, content, template) {
        // eslint-disable-next-line
        let requestPathname = template || req._parsedUrl.pathname;
        try {
            const tpl = swig.compileFile(templatePath + requestPathname);
            res.send(tpl(Object.assign({
                now: Math.round((new Date()).getTime() / 1000),
                cookies: req.cookies,
                signedCookies: req.signedCookies,
                queryString: req.query,
                requestHeaders: req.headers,
            }, content)));
        } catch (err) {
            res.status(404).send(`Page not found: ${err}`);
        }
    }

    function renderApi(req, res, status, content, opt = {}) {
        if (typeof res.set === 'function') {
            if (opt.cacheTime) {
                res.set('Cache-Control', `public, max-age=${opt.cacheTime}`);
            } else if (opt.cacheControl) {
                res.set('Cache-Control', opt.cacheControl);
            } else {
                res.set('Cache-Control', 'no-cache');
            }
            res.set('Vary', 'Origin');
        }
        res.status(status).json(content);
    }

    function renderError(req, res, err) {
        const errorMessage = `<center><h1>Something awful happend...</h1>
            A special force is looking into this right now!<br>
            <br>
            Please try again later...<br>
            <xmp>
               method: ${req.method}
               url: ${req.url}
               headers: ${req.headers}
            </xmp>

            Server Error (This should not be displayed to the users):
            <xmp>
               ${err}
            </xmp>
        </center>`;
        res.status(500).send(errorMessage);
    }

    function cleanHtml($input) {
        const input = $input.replace(/<(h[1-9]).+?>.+?<\/\1>/gi, '');
        return input.replace(/<.+?>/g, ' ');
    }

    function mapNorwegianLetter(match, letter) {
        switch (letter) {
            case 'æ': return 'a';
            case 'ø': return 'o';
            case 'å': return 'a';
            default: return letter;
        }
    }

    function asUrlSafe($input) {
        return encodeURIComponent(
            stripTags($input),
        );
    }

    function asHtmlIdSafe($string) {
        if (typeof $string === 'string') {
            const string = $string.toLowerCase()
                .replace(/æ/i, 'e')
                .replace(/ø/i, 'o')
                .replace(/å/i, 'a')
                .replace(/[^a-z0-9]/gi, '-')
                .replace(/-+/g, '-')
                .replace(/^-/g, '')
                .replace(/-$/g, '');
            return string;
        }
        return $string;
    }

    function asLinkPart($input) {
        let input = String($input).toLowerCase();
        input = input.replace(/([æøå])/gi, mapNorwegianLetter);
        input = input.replace(/[^a-z0-9_-]/g, '-');
        input = input.replace(/-+/g, '-');
        return input;
    }

    function stripTags($input) {
        return String($input).replace(/<[^>]*>/g, '');
    }

    function uc($input) {
        return String($input).toUpperCase();
    }

    return {
        replaceMarked,
        inlineImageSize,
        replaceBBTags,
        replaceContentTags,
        replaceDataTags,
        replaceAt,
        dropFirstLetter,
        dropFirstLetterAfterHr,
        runPlugins,
        renderPage,
        renderApi,
        renderError,
        cleanHtml,
        asUrlSafe,
        asHtmlIdSafe,
        asLinkPart,
        stripTags,
        uc,
    };
}

module.exports = htmlUtilities();
