'use strict';

const path = require('path');
const swig = require('swig');
const marked = require('marked');
const fs = require('fs');
const util = require('./utilities');

const appPath = path.normalize(`${__dirname}/../`);
const templatePath = `${appPath}template/current`;

const renderer = new marked.Renderer();
const highlight = function highlight(code) {
    // eslint-disable-next-line
    return require('highlight.js').highlightAuto(code).value;
};

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
    return `<h${level} class="toc-${level}"><a name="${
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
    const result = src.match(/#([a-z0-9,]+)$/);
    if (result) {
        const allClasses = result[1].split(',');
        if (allClasses[0] === 'card') {
            return `
                <div class="card float-right col-lg-4 col-md-6 col-sm-12 p-0 ml-2 mb-2 mt-2">
                    <img class="card-img-top" src="${src}" alt="${title || text}">
                    <div class="card-body">
                        <h5 class="card-title">${text || ''}</h5>
                        <p class="card-text">${title || ''}</p>
                    </div>
                </div>`;
        }
        if (allClasses[0] === 'card2') {
            return `
                <div class="float-right card col-lg-7 col-md-7 col-sm-12 p-0 ml-2 mb-2 mt-2">
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
                 <p class="${mediaClass.join(' ')}">
                    <img src="${src}" alt="${title || text}" title="${title || text}" class="img-fluid">
                    <div class="image_inline_text"><strong>${text || ''}</strong> ${title || ''}</div>
                </p>
            `;
        }
        if (allClasses[0] === 'plain') {
            return `
                <div class='d-flex justify-content-center'>
                    <img src="${src}" alt="${title || text}" title="${title || text}" class="img-fluid">
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
                <div class='row d-flex justify-content-center'>
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
        <p class="image_inline ${mediaClass.join(' ')} FOOBAR">
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

    function replaceMarked(input) {
        if (typeof input === 'string') {
            const fixedInput = fixImageLinksWhiteSpace(input);
            return marked(fixedInput);
        }
        return input;
    }

    function inlineImageSize($input, $size) {
        const input = $input.replace(/(<img.+?)\?w=[0-9]+/gi, `$1?w=${$size}`);
        return input;
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
                opts[param[0]] = param[1];
            });
            if (!opts.articleId) {
                opts.articleId = article.id;
            }

            const replacerResult = `<div class='w-100 my-4' data-widget-host="simple-blog-${opts.name}">
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

        const reg = /\{\{([a-zA-Z0-9 =_-,]+)\}\}/g;
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

    function renderApi(req, res, status, content) {
        res.set('Cache-Control', 'no-cache');
        res.set('Vary', 'Origin');
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
