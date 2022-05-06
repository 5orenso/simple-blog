'use strict';

import util from './util';
const marked = require('marked');
// const hljs = require('highlight.js');
// import 'highlight.js/styles/atom-one-dark.css';
const renderer = new marked.Renderer();

// hljs.configure({
//   tabReplace: '    ',      // 4 spaces
//   classPrefix: 'hljs-',     // don't append class prefix
//                            // … other options aren't changed
// });

renderer.heading = function heading(text, level) {
    const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
    return `<h${level} class='toc-${level}'><a name='${
        escapedText
    }' class='anchor' href='#${
        escapedText
    }'><span class='header-link'></span></a>${
        text}</h${level}>`;
};

renderer.table = function table(header, body) {
    return `<table class='table table-striped table-hover'>
        <thead class='thead-dark'>${header}</thead>
        <tbody>${body}</tbody>
    </table>`;
};

renderer.blockquote = function blockquote(quote) {
    return `<blockquote class='blockquote text-muted ml-5'>
        <span class='display-4 float-left mr-4'>
            <i class="fas fa-quote-right"></i>
        </span>
        <p class='mb-0'>${quote}</p>
    </blockquote>`;
};

// renderer.code = function code(code, infostring, escaped) {
//     return `<pre>
//         <code class="language-${infostring} hljs rounded-lg">${
//             infostring ? hljs.highlight(infostring, code).value : hljs.highlightAuto(code).value
//         }</code>
//     </pre>`;
// };

renderer.image = function image($href, title, text) {
    if ($href.match(/youtube.com/)) {
        const regexp = /(^|[\s\t\n]+)https*:\/\/(www\.)*youtube\.com\/(.*?v=([^&\s]+)(&[^\s]+)*)/gi;
        const youtubeVideo = $href.replace(regexp, (match, p0, p1, p2, p3) => {
            return p3;
        });
        // <iframe class='embed-responsive-item' src='https://www.youtube.com/embed/${youtubeVideo}?rel=0' allowfullscreen  width='1900' height='1200'></iframe>
        return `
            <div class='youtube' data-embed='${youtubeVideo}'>
                <div class='play-button'></div>
                <img src='https://img.youtube.com/vi/${youtubeVideo}/sddefault.jpg'>
            </div>
            <div class='image_inline_text'><strong>${text || ''}</strong> ${title || ''}</div>
        `;
    }
    let serverName = '';
    if (document.domain === 'localhost' && !$href.match(/^http/)) {
        serverName = 'http://localhost:8080';
    }
    const src = `${serverName}${$href}`;
    const href = $href.replace(/(w=[0-9]+)/, 'w=1800');
    const mediaClass = [];
    const result = src.match(/#([a-z0-9,-]+)$/i);
    if (result) {
        const allClasses = result[1].split(',');
        if (allClasses[0] === 'card') {
            return `
                <div class='card float-right col-lg-4 col-md-6 col-sm-12 p-0 ml-2 mb-2 mt-2 ${allClasses.join(' ')}'>
                    <img class='card-img-top' src='${src}' alt='${title || text}'>
                    <div class='card-body'>
                        <h5 class='card-title'>${text || ''}</h5>
                        <p class='card-text'>${title || ''}</p>
                    </div>
                </div>`;
        }
        if (allClasses[0] === 'card2') {
            return `
                <div class='float-right card col-lg-7 col-md-7 col-sm-12 p-0 ml-2 mb-2 mt-2 ${allClasses.join(' ')}'>
                    <div class='row no-gutters'>
                        <div class='col-md-4'>
                            <img class='card-img img-fluid' src='${src}' alt='${title || text}'>
                        </div>
                        <div class='col-md-8'>
                            <div class='card-body'>
                                <h5 class='card-title'>${text || ''}</h5>
                                <p class='card-text'>${title || ''}</p>
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
                <div class='row d-flex justify-content-center ${allClasses.join(' ')}'>
                    <img src='${src}' alt='${title || text}' title='${title || text}' class='img-fluid'>
                    <div class='image_inline_text'><strong>${text || ''}</strong> ${title || ''}</div>
                </div>
            `;
        }
        for (let i = 0, l = allClasses.length; i < l; i += 1) {
            mediaClass.push(allClasses[i]);
        }
    }
    return `
        <p class='image_inline ${mediaClass.join(' ')}'>
            <a href='${href}' data-smoothzoom='group1' title='${title || text}'>
                <img src='${src}' alt='${title || text}' title='${title || text}' class='img-fluid'>
            </a>
            <div class='image_inline_text'><strong>${text || ''}</strong> ${title || ''}</div>
        </p>`;
};

// Markdown setup.
marked.setOptions({
    renderer: renderer,
    // highlight: function(code, language) {
    //     // console.log(code, language);
    //     // if (language) {
    //     //     return hljs.highlight(language, code).value;
    //     // }
    //     return hljs.highlightAuto(code).value;
    // },
    pedantic: false,
    gfm: true,
    tables: true,
    breaks: true,
    sanitize: false,
    smartLists: true,
    smartypants: true,
    xhtml: false,
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
class HtmlUtilities {
    static replaceMarked(input) {
        if (typeof input === 'string') {
            const fixedInput = HtmlUtilities.fixImageLinksWhiteSpace(input);
            return marked(fixedInput);
        }
    }

    static fixImageLinksWhiteSpace(input) {
        function replacerImageWhiteSpace(match, p1, p2, p3) {
            const imageSrc = p2.replace(/ /g, '%20');
            const result = `![${p1}](${imageSrc}${p3})`;
            return result;
        }
        const reg = /\!\[(.+?)\]\((.+?\.[a-z]{3,4})(.*?)\)/gi;
        return input.replace(reg, replacerImageWhiteSpace);
    }

    static inlineImageSize($input, $size) {
        const input = $input.replace(/(<img.+?)\?w=[0-9]+/gi, `$1?w=${$size}`);
        return input;
    }

    static replaceAt(string, index, replace) {
        return string.substring(0, index) + replace + string.substring(index + 1);
    }

    static dropFirstLetter($string) {
        let mode = 0;
        for (let i = 0, l = $string.length; i < l; i += 1) {
            const letter = $string.charAt(i);
            if (letter === '<') {
                mode = 1;
            } else if (letter === '>') {
                mode = 0;
            }
            if (mode === 0 && letter.match(/\w/)) {
                return HtmlUtilities.replaceAt($string, i, `<span class='blog-drop-letter'>${letter}</span>`);
            }
        }
        return $string;
    }

    static dropFirstLetterAfterHr($string) {
        const stringParts = $string.split('<hr>');
        for (let i = 0, l = stringParts.length; i < l; i += 1) {
            stringParts[i] = HtmlUtilities.dropFirstLetter(stringParts[i]);
        }
        return stringParts.join('<hr>');
    }

    static cleanHtml($input) {
        const input = $input.replace(/<(h[1-9]).+?>.+?<\/\1>/gi, '');
        return input.replace(/<.+?>/g, ' ');
    }

    static replaceDataTags($content, article) {
        if (typeof $content !== 'string') {
            return $content;
        }
        let content = $content;
        function replacerTags(match, $p1, $p2) {
            const p1 = $p1.replace(/\+/g, ' ');
            // console.log('replacerTags', match, p1, p2);
            if (p1.match(/^fa-/)) {
                let result = `<span class='fa ${p1}'></span>`;
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

        const reg = /\[:([a-z_\-0-9.\+]+)(\s[a-z_\-0-9.\+]+)*?\]/gi;
        content = content.replace(reg, replacerTags);
        return content;
    }

    static replaceBBTags(content = '', article = {}, config = { blog: {} }) {
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
                const replacerResult = `<div class='w-100 ${opts.containerClasses || 'my-3 border'} clearfix' data-widget-host="simple-blog-${tag}">
                <h3>WIDGET: ${tag}</h3>
<xmp>
    "apiServer": "${config.blog.protocol}://${config.blog.domain}",
    "content": "${content}",
${Object.keys(opts).map(key => `    "${key}": "${opts[key]}"`).join(',\n')}
</xmp>
</div>
<script async src="/preact/simple-blog-${tag}/bundle.js?time=${new Date().getTime()}"></script>
                `;
                return replacerResult;
            }
            if (['left'].includes(tag)) {
                return `<div class='row my-4 clearfix'><div class='col-xl-4 col-lg-5 col-md-6 col-sm-12'>
${marked(contentLines[0])}
</div><div class='col-xl-8 col-lg-7 col-md-6 col-sm-12'>
${contentLines.slice(1).join('\n')}
</div></div>`;
            }
            if (['right'].includes(tag)) {
                return `<div class='row my-4 clearfix'><div class='col-xl-8 col-lg-7 col-md-6 col-sm-12'>
${contentLines.slice(1).join('\n')}
</div><div class='col-xl-4 col-lg-5 col-md-6 col-sm-12'>
${marked(contentLines[0])}
</div></div>`;
            }
        }
        const reg = /\[([a-z]+)(.*?)\]([\s\S]*?(?=\[\/\1\]))\[\/\1\]/g;
        const finalResult = content.replace(reg, replacer);
        return finalResult;
    }

    static replaceContentTags(content = '', article = {}, config = { blog: {} }) {
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

            const replacerResult = `<div class='w-100 ${opts.containerClasses || 'my-3'} clearfix border' data-widget-host="simple-blog-${opts.name}">
                <h3>WIDGET: ${opts.name}</h3>
<xmp>
    "apiServer": "${config.blog.protocol}://${config.blog.domain}",
${Object.keys(opts).map(key => `    "${key}": "${opts[key]}"`).join(',\n')}
</xmp>
</div>
            `;
            return replacerResult;
        }

        const reg = /\{\{([a-zA-ZæøåÆØÅ0-9 ,=;:_./-]+)\}\}/g;
        const finalResult = content.replace(reg, replacer);
        return finalResult;
    }

    static mapNorwegianLetter(match, letter) {
        switch (letter) {
            case 'æ': return 'a';
            case 'ø': return 'o';
            case 'å': return 'a';
            default: return letter;
        }
    }

    static asUrlSafe($input) {
        return encodeURIComponent(
            HtmlUtilities.stripTags($input),
        );
    }

    static asLinkPart($input) {
        let input = String($input).toLowerCase();
        input = input.replace(/([æøå])/gi, HtmlUtilities.mapNorwegianLetter);
        input = input.replace(/[^a-z0-9_-]/g, '-');
        input = input.replace(/-+/g, '-');
        return input;
    }

    static stripTags($input) {
        return String($input).replace(/<[^>]*>/g, '');
    }

    static uc($input) {
        return String($input).toUpperCase();
    }
}

export default HtmlUtilities;
