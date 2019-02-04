'use strict';

const util = require('./utilities');
const path = require('path');
const swig = require('swig');
const marked = require('marked');

const appPath = path.normalize(`${__dirname}/../`);
const templatePath = `${appPath}template/current`;

const renderer = new marked.Renderer();
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

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function htmlUtilities() {
    function replaceMarked(input) {
        return marked(input, { renderer });
    }

    function inlineImageSize($input, $size) {
        const input = $input.replace(/(<img.+?)\?w=[0-9]+/gi, `$1?w=${$size}`);
        return input;
    }

    function replaceDataTags($content, article) {
        let content = $content;
        function replacerTags(match, p1, p2) {
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
            }
            return util.returnString(article, p1.split('.')) || '';
        }

        const reg = /\[:([a-z_\-0-9.]+)(\s[a-z_\-0-9]+)*?\]/gi;
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

    return {
        replaceMarked,
        inlineImageSize,
        replaceDataTags,
        replaceAt,
        dropFirstLetter,
        dropFirstLetterAfterHr,
        renderPage,
        renderApi,
        renderError,
        cleanHtml,
    };
};

module.exports = htmlUtilities();
