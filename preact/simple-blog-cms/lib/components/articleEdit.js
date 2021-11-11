import { h, Component } from 'preact';

import linkstate from 'linkstate';

import ImageUpload from './imageUpload';
import MessagesLite from './messagesLite';

import Edit from './article/edit';
import Menu from './article/menu';

import util from '../util';
import utilHtml from '../util-html';

const initialState = {
    currentMenu: 'preview',
    currentTagIdx: -1,
    currentTag: '',
    toggleDropdown: {},
    youtube: {},
    youtubeTitle: {},
    youtubeText: {},
    markdown: {
        tableX: 3,
        tableY: 5,
        codeLanguage: util.get('markdownCodeLanguage'),
    },
    backgroundHexR: 255,
    backgroundHexG: 255,
    backgroundHexB: 255,
    backgroundHex: '#ffffff',
    forgroundHexR: 0,
    forgroundHexG: 0,
    forgroundHexB: 0,
    forgroundHex: '#000000',
    fontsizeH1: 4,
    fontweightH1: 600,
    fontsizeH3: 1.3,
    fontweightH3: 600,
    fontsizeH5: 1.2,
    fontweightH5: 600,
    language: 'no',
};
const debug = false;
const editMode = 'textarea'; // div
const imageWidth = 150;

const statusList = [
    { value: 1, title: 'I arbeid' },
    { value: 2, title: 'Live' },
];

const widgetList = ['clock', 'booking', 'form', 'sheet', 'poll', 'gallery', 'weather', 'map', 'rating', 'related', 'cookies'];

const widgetFields = {
    clock: ['class', 'style', 'countdownto', 'showDateOnly', 'showSeconds', 'showTimezone', 'showClockOnly'],
    booking: ['class', 'style', 'table-class', 'sheetId'],
    form: ['class', 'style', 'table-class', 'sheetId'],
    sheet: ['class', 'style', 'table-class', 'sheetId', 'showDocTitle', 'limit', 'showSearch'],
    poll: ['class', 'style'],
    gallery: ['class', 'style', 'class-photo', 'class-photo-img', 'start', 'end'],
    weather: ['class', 'style', 'name', 'height', 'lat', 'lon', 'date'],
    map: ['class', 'style'],
    rating: ['class', 'style', 'from', 'to'],
    related: ['class', 'style', 'tags'],
    cookies: ['class', 'style'],
};

function pad(n) {
    return (n.length < 2) ? `0${n}` : n;
}

function isImage(filename = '') {
    return filename.match(/(jpg|jpeg|png|gif|heic|heif|svg|webp|tif)/i);
}

export default class ArticleEdit extends Component {
    constructor(props) {
        super(props);
        this.state = Object.assign({}, initialState);
        this.parent = props.that;
        this.imageServer = this.parent.props.apiServer;
        this.serverName = '';
        if (document.domain === 'localhost') {
            this.serverName = 'http://localhost:8080';
        }
    }

    markdownTable(csvContent = '', title = '') {
        const lines = csvContent.split('\n');
        let markdownTable = `\n\n#### ${title}\n`;

        let maxLengthCols = [];
        let isNumberCols = [];
        for (let i = 0, l = lines.length; i < l; i += 1) {
            const cols = lines[i].split('\t');
            for (let j = 0, m = cols.length; j < m; j += 1) {
                const col = cols[j].trim();
                if (!maxLengthCols[j] || col.length > maxLengthCols[j]) {
                    maxLengthCols[j] = col.length;
                }
                if (i > 0) {
                    isNumberCols[j] = util.isNumber(util.asNumber(col));
                }
            }
        }

        let headLine;
        for (let i = 0, l = lines.length; i < l; i += 1) {
            const cols = lines[i].split('\t');
            markdownTable += '| ';
            if (i === 0) {
                headLine = '| ';
            }
            for (let j = 0, m = cols.length; j < m; j += 1) {
                const col = String(cols[j]);
                const newCol = col.padStart(maxLengthCols[j], ' ');
                markdownTable += `${newCol} |`;
                if (i === 0) {
                    headLine += `${newCol}${isNumberCols[j] ? ':' : ''}|`;
                }
            }
            markdownTable += '\n';
            if (i === 0) {
                const sep = headLine.replace(/[^|:]/g, '-');
                markdownTable += `${sep}\n`;
            }
        }
        markdownTable += '\n\n';
        return markdownTable;
    }

    markdownQuote(quote) {
        const lines = quote.split('\n');
        let markdownQuote = '\n\n';
        for (let i = 0, l = lines.length; i < l; i += 1) {
            const line = lines[i];
            markdownQuote += `> ${line}\n`;
        }
        markdownQuote += '\n\n';
        return markdownQuote;
    }

    markdownCode(code, lang) {
        util.set('markdownCodeLanguage', lang);
        const quote = '```';
        let markdownCode = `\n\n${quote}${lang}\n`;
        markdownCode += code;
        markdownCode += `\n${quote}\n\n`;
        return markdownCode;
    }

    handleDropdownClick = (event, key) => {
        event.preventDefault();
        const el = event.target;

        let { toggleDropdown } = this.state;
        if (toggleDropdown[key]) {
            toggleDropdown[key] = false;
        } else {
            toggleDropdown[key] = true;
        }
        this.setState({ toggleDropdown });
    }

    handleMenuClick = (event) => {
        event.preventDefault();
        const el = event.target.closest('a');

        const currentMenu = el.dataset.menu;
        this.setState({ currentMenu });
        // if (currentMenu === 'preview') {
        // } else if (currentMenu === 'images') {
        // }
    };

    handleClickCode = (event) => {
        event.preventDefault();
        const el = event.target;
        if (el && this.state.currentTextarea) {
            this.parent.typeInTextarea(this.state.currentTextarea, el.dataset.content || el.innerHTML);
        } else {
            this.parent.addWarning('Textarea not selected.');
        }
    };

    handleTextareaFocus = (event) => {
        const el = event.target;
        this.setState({ currentTextarea: el });
    };

    handleKeydown = (event, handleInput, taglist) => {
        let currentTagIdx = this.state.currentTagIdx;
        let currentTag;
        const total = taglist.length;
        if (event.key === 'Enter') {
            handleInput(event, {
                action: 'add',
                name: 'tags',
                type: 'array',
            });
            currentTagIdx = 0;
            if (taglist[currentTagIdx]) {
                currentTag = taglist[currentTagIdx].title;
            }
        } else if (event.key === 'Backspace' || event.key === 'Escape') {
            currentTagIdx = -1;
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            currentTagIdx = currentTagIdx - 1;
            if (currentTagIdx <= -1) {
                currentTagIdx = -1;
            } else {
                currentTag = taglist[currentTagIdx].title;
            }
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            currentTagIdx = currentTagIdx + 1;
            if (currentTagIdx >= total) {
                currentTagIdx = 0;
            }
            currentTag = taglist[currentTagIdx].title;
        }
        this.setState({ currentTagIdx, currentTag });
        return true;
    };

    handleTagsInput = (event, handleInput) => {
        // TODO: Add force to lower case function.
        event.target.value = event.target.value.toLowerCase();
        handleInput(event, {
            action: 'search',
            name: 'tags',
            type: 'array',
        });
    };

    handleTagAdd = (event, handleInput, tag) => {
        handleInput(event, {
            action: 'add',
            name: 'tags',
            value: tag.toLowerCase(),
            type: 'array',
        });
    };

    handleTagRemove = (event, handleInput, tag) => {
        handleInput(event, {
            action: 'remove',
            name: 'tags',
            value: tag.toLowerCase(),
            type: 'array',
        });
    };

    handleImageErrored = (e) => {
        const image = e.target;

        if (!image.dataset.retry) {
            image.dataset.retry = 0;
        }
        image.dataset.retry = parseInt(image.dataset.retry, 10) + 1;
        if (image.dataset.retry > 5) {
            return false;
        }

        image.onerror = null;
        setTimeout(() => {
            image.src += `?${new Date()}`;
        }, 1000);
    }

    setColor = (e) => {
        const handleInputRaw = this.props.handleInputRaw;
        const { finalname } = e.target.dataset;
        const { name, value } = e.target;
        this.setState({
            [`${name}`]: value,
        }, () => {
            const {
                [`${finalname}HexR`]: r,
                [`${finalname}HexG`]: g,
                [`${finalname}HexB`]: b,
            } = this.state;

            const r_hex = parseInt(r, 10).toString(16);
            const g_hex = parseInt(g, 10).toString(16);
            const b_hex = parseInt(b, 10).toString(16);
            const hex = '#' + pad(r_hex) + pad(g_hex) + pad(b_hex);

            this.setState({
                [`${finalname}Hex`]: hex,
            });

            handleInputRaw(finalname, hex);
        })
    }

    setColorToValue = (e) => {
        const handleInputRaw = this.props.handleInputRaw;
        const { finalname, hexfixed, rfixed, gfixed, bfixed } = e.target.dataset;
        this.setState({
            [`${finalname}Hex`]: hexfixed,
            [`${finalname}HexR`]: rfixed,
            [`${finalname}HexG`]: gfixed,
            [`${finalname}HexB`]: bfixed,
        }, () => {
            handleInputRaw(finalname, hexfixed);
        });
    }

    setColorToHex = (e) => {
        const handleInputRaw = this.props.handleInputRaw;
        const { value } = e.target;
        const { finalname } = e.target.dataset;
        const rgbHex = value ? value.replace(/#/, '').match(/.{1,2}/g) : [];
        const rgb = [
            parseInt(rgbHex[0], 16),
            parseInt(rgbHex[1], 16),
            parseInt(rgbHex[2], 16),
        ];

        this.setState({
            [`${finalname}Hex`]: value,
            [`${finalname}HexR`]: rgb[0],
            [`${finalname}HexG`]: rgb[1],
            [`${finalname}HexB`]: rgb[2],
        }, () => {
            handleInputRaw(finalname, value);
        });
    }

    toggleLanguageMenu = (e) => {
        const { lang } = e.target.closest('button').dataset;
        this.setState({
            language: lang,
        });
    }

    translateToEnglish = async (e) => {
        const { fromfield, tofield } = e.target.closest('button').dataset;
        const { article, handleTextareaInput } = this.props;
        const data = {
            method: 'POST',
            text: article[fromfield],
        };
        util.fetchApi(`/api/translate/`, { method: 'POST', data }, this)
            .then((result) => {
                handleTextareaInput({
                    target: {
                        name: tofield,
                        value: result.data.translatedText,
                    },
                });
            })
            .catch(error => this.addError(error.toString()));

    }

    componentDidMount() {
        console.log('componentDidMount');
        const article = this.props.article;

        const backgroundRgbHex = article.background ? article.background.replace(/#/, '').match(/.{1,2}/g) : [];
        const backgroundRgb = [
            parseInt(backgroundRgbHex[0], 16),
            parseInt(backgroundRgbHex[1], 16),
            parseInt(backgroundRgbHex[2], 16)
        ];
        const forgroundRgbHex = article.forground ? article.forground.replace(/#/, '').match(/.{1,2}/g) : [];
        const forgroundRgb = [
            parseInt(forgroundRgbHex[0], 16),
            parseInt(forgroundRgbHex[1], 16),
            parseInt(forgroundRgbHex[2], 16)
        ];

        this.setState({
            backgroundHex: article.background,
            backgroundHexR: backgroundRgb[0],
            backgroundHexG: backgroundRgb[1],
            backgroundHexB: backgroundRgb[2],
            forgroundHex: article.forground,
            forgroundHexR: forgroundRgb[0],
            forgroundHexG: forgroundRgb[1],
            forgroundHexB: forgroundRgb[2],
        });

    }

    render(props) {
console.log('articleEdit.render');
        const {
            currentMenu, currentTagIdx, currentTag, toggleDropdown,
            backgroundHex, backgroundHexR, backgroundHexG, backgroundHexB,
            forgroundHex, forgroundHexR, forgroundHexG, forgroundHexB,
            fontsizeH1, fontweightH1, fontsizeH3, fontweightH3, fontsizeH5, fontweightH5,
            language,
        } = this.state;
        const that = props.that;
        const { imageServer, imagePath } = props;
        const previewJwtToken = props.previewJwtToken;
        const styles = props.styles;
        const messages = props.messages;
        const article = props.article;
        const sessionEmail = props.sessionEmail;
        const handleInput = props.handleInput;
        const handleInputRaw = props.handleInputRaw;
        const handleAddImage = props.handleAddImage;
        const handleRemoveImageClick = props.handleRemoveImageClick;
        const handleTextareaInput = props.handleTextareaInput;
        const handleClickSave = props.handleClickSave;
        const handleClickNew = props.handleClickNew;
        const handleClickBack = props.handleClickBack;

        const handleImageInput = props.handleImageInput;
        const handleImageSubmit = props.handleImageSubmit;
        const handleImglistClick = props.handleImglistClick;
        const handleImageTagClick = props.handleImageTagClick;

        const taglist = props.taglist;
        const imglist = props.imglist;
        const catlist = props.catlist;
        const filterQuery = props.filterQuery;

        const authorDefault = sessionEmail.replace(/\@.+$/, '');

        const images = article.img || [];
        const imagesTotal = images.length;
        const renderImages = images.slice(0, 1).map((img) => {
            const isImg = isImage(img.ext || img.src);
            if (img.src && isImg) {
                return (
                    <img src={`https://${imageServer}/800x/${imagePath}/${img.src}`} alt='' title='' class='img-fluid' onError={this.handleImageErrored} />
                );
            }
        });

        // const renderedMenu = (
        //     <nav class='nav nav-pills nav-fill mb-3 sticky-top bg-light'>
        //         <a class={`nav-item nav-link ${currentMenu === 'preview' ? 'active' : ''}`} href='#'
        //             onClick={this.handleMenuClick} data-menu='preview'><i class='fas fa-eye'></i> Forhåndsvisning</a>
        //         <a class={`nav-item nav-link ${currentMenu === 'frontpagepreview' ? 'active' : ''}`} href='#'
        //             onClick={this.handleMenuClick} data-menu='frontpagepreview'><i class='fas fa-eye'></i> I lister</a>
        //         <a class={`nav-item nav-link ${currentMenu === 'images' ? 'active' : ''}`} href='#'
        //             onClick={this.handleMenuClick} data-menu='images'><i class='fas fa-images'></i> Bilder ({imagesTotal})</a>
        //         <a class={`nav-item nav-link ${currentMenu === 'youtube' ? 'active' : ''}`} href='#'
        //             onClick={this.handleMenuClick} data-menu='youtube'><i class='fas fa-video'></i> Youtube</a>
        //         <a class={`nav-item nav-link ${currentMenu === 'links' ? 'active' : ''}`} href='#'
        //             onClick={this.handleMenuClick} data-menu='links'><i class='fas fa-link'></i> Lenker</a>
        //         <a class={`nav-item nav-link ${currentMenu === 'meta' ? 'active' : ''}`} href='#'
        //             onClick={this.handleMenuClick} data-menu='meta'><i class='fas fa-tags'></i> Meta</a>
        //         <a class={`nav-item nav-link ${currentMenu === 'markdown' ? 'active' : ''}`} href='#'
        //             onClick={this.handleMenuClick} data-menu='markdown'><i class='fas fa-code'></i> Annet</a>
        //     </nav>
        // );

        const shareLink = `${this.imageServer}/${utilHtml.asLinkPart(article.category)}/${utilHtml.asLinkPart(article.title)}/${article.id}`;
// {/* <div class='rounded-lg' style={`background-color: ${backgroundHex};`}>
//                                     <h1 style={`color: ${forgroundHex}; font-size: ${article.fontsize}em; font-weight: ${article.fontweight};`}>{article.title}</h1>
//                                 </div> */}

        const renderedFrontpagePreview = (
            <div class='col-12 pt-3'>
                <div class='row'>
                    <div class='col-12 pt-3' style={`background-color: ${backgroundHex}; color: ${forgroundHex};`}>
                        {renderImages}
                        <h1 style={`color: ${forgroundHex}; font-size: ${article.fontsizeH1}rem; font-weight: ${article.fontweightH1};`}>{article.title}</h1>
                        <h5>{article.teaser}</h5>
                        <div>
                            <small>
                                {util.asHumanReadable(article.published)}
                                {util.asHumanReadable(article.published) !== util.asHumanReadable(article.updatedDate) && <span class='text-muted'> / <i class='fas fa-undo' /> {util.asHumanReadable(article.updatedDate)}</span>}
                                &nbsp; /  <i class='far fa-folder-open' /> {article.category}
                                &nbsp; / &nbsp;
                                <span class={`badge badge-${util.getStatusClass(article.status)} p-2`}>
                                    {util.getStatus(article.status)}
                                </span>
                                &nbsp; / 
                                &nbsp;<a rel='noopener' target='_blank' href={`https://www.facebook.com/sharer.php?u=${shareLink}`}>
                                    <i class='fab fa-facebook'></i>
                                </a>
                                &nbsp;<a rel='noopener' target='_blank' href={`https://twitter.com/intent/tweet?url=${shareLink}`
                                    + `&text=${utilHtml.asUrlSafe(article.title)}.%20`
                                    + `${utilHtml.asUrlSafe(article.teaser || article.ingress)}`
                                    + `&via=${utilHtml.asUrlSafe(this.imageServer)}`
                                    + `&hashtags=${utilHtml.asUrlSafe(article.tags)}`}>
                                    <i class='fab fa-twitter'></i>
                                </a>
                                &nbsp;<a rel='noopener' target='_blank' href={`https://www.linkedin.com/shareArticle?mini=true`
                                    + `&url=${shareLink}`
                                    + `&summary=${utilHtml.asUrlSafe(article.title)}.%20`
                                    + `${utilHtml.asUrlSafe(article.teaser || article.ingress)}`
                                    + `&source=${utilHtml.asUrlSafe(this.imageServer)}`}>
                                    <i class='fab fa-linkedin-in'></i>
                                </a>
                                &nbsp;<a rel='noopener' target='_blank' href={`mailto:?subject=Tips: `
                                    + `${utilHtml.asUrlSafe(article.title)}`
                                    + `&body=Tips fra ${utilHtml.asUrlSafe(this.imageServer)}:%0D%0A%0D%0A`
                                    + `${utilHtml.asUrlSafe(utilHtml.uc(article.title))}%0D%0A%0D%0A`
                                    + `${utilHtml.asUrlSafe(article.teaser || article.ingress)}%0D%0A%0D%0A`
                                    + `Les mer: ${shareLink}`}>
                                    <i class='far fa-envelope'></i>
                                </a>
                                &nbsp; /                        
                                Ord: {util.wordCount(article.body)}
                                &nbsp; /                        
                                Lesetid: {util.readTime(article.body, 'no')}
                            </small>
                        </div>
                        <div class='mb-3'>
                            <small>
                                {Array.isArray(article.tags) && article.tags.map(tag =>
                                    <span class='badge badge-info mr-1'>{tag}</span>
                                )}
                            </small>
                        </div>
                        <div class='lead' id='ingressDisplay' dangerouslySetInnerHTML={{
                            __html: utilHtml.replaceMarked(
                                utilHtml.replaceDataTags(article.ingress, article)
                            ),
                        }}></div>
                    </div>
                </div>
                <div class='row mt-4'>
                    <div class='col-4 pt-3' style={`background-color: ${backgroundHex}; color: ${forgroundHex};`}>
                        {renderImages}
                        <h3 style={`color: ${forgroundHex}; font-size: ${article.fontsizeH3}rem; font-weight: ${article.fontweightH3};`}>{article.title}</h3>
                        <h5>{article.teaser}</h5>
                        <div>
                            <small>
                                {util.asHumanReadable(article.published)}
                                {util.asHumanReadable(article.published) !== util.asHumanReadable(article.updatedDate) && <span class='text-muted'> / <i class='fas fa-undo' /> {util.asHumanReadable(article.updatedDate)}</span>}
                                &nbsp; /  <i class='far fa-folder-open' /> {article.category}
                                &nbsp; / &nbsp;
                                <span class={`badge badge-${util.getStatusClass(article.status)} p-2`}>
                                    {util.getStatus(article.status)}
                                </span>
                                &nbsp; / 
                                &nbsp;<a rel='noopener' target='_blank' href={`https://www.facebook.com/sharer.php?u=${shareLink}`}>
                                    <i class='fab fa-facebook'></i>
                                </a>
                                &nbsp;<a rel='noopener' target='_blank' href={`https://twitter.com/intent/tweet?url=${shareLink}`
                                    + `&text=${utilHtml.asUrlSafe(article.title)}.%20`
                                    + `${utilHtml.asUrlSafe(article.teaser || article.ingress)}`
                                    + `&via=${utilHtml.asUrlSafe(this.imageServer)}`
                                    + `&hashtags=${utilHtml.asUrlSafe(article.tags)}`}>
                                    <i class='fab fa-twitter'></i>
                                </a>
                                &nbsp;<a rel='noopener' target='_blank' href={`https://www.linkedin.com/shareArticle?mini=true`
                                    + `&url=${shareLink}`
                                    + `&summary=${utilHtml.asUrlSafe(article.title)}.%20`
                                    + `${utilHtml.asUrlSafe(article.teaser || article.ingress)}`
                                    + `&source=${utilHtml.asUrlSafe(this.imageServer)}`}>
                                    <i class='fab fa-linkedin-in'></i>
                                </a>
                                &nbsp;<a rel='noopener' target='_blank' href={`mailto:?subject=Tips: `
                                    + `${utilHtml.asUrlSafe(article.title)}`
                                    + `&body=Tips fra ${utilHtml.asUrlSafe(this.imageServer)}:%0D%0A%0D%0A`
                                    + `${utilHtml.asUrlSafe(utilHtml.uc(article.title))}%0D%0A%0D%0A`
                                    + `${utilHtml.asUrlSafe(article.teaser || article.ingress)}%0D%0A%0D%0A`
                                    + `Les mer: ${shareLink}`}>
                                    <i class='far fa-envelope'></i>
                                </a>
                                &nbsp; /                        
                                Ord: {util.wordCount(article.body)}
                                &nbsp; /                        
                                Lesetid: {util.readTime(article.body, 'no')}
                            </small>
                        </div>
                        <div class='mb-3'>
                            <small>
                                {Array.isArray(article.tags) && article.tags.map(tag =>
                                    <span class='badge badge-info mr-1'>{tag}</span>
                                )}
                            </small>
                        </div>
                        <div class='lead' id='ingressDisplay' dangerouslySetInnerHTML={{
                            __html: utilHtml.replaceMarked(
                                utilHtml.replaceDataTags(article.ingress, article)
                            ),
                        }}></div>
                    </div>
                    <div class='col-3 offset-1 pt-3' style={`background-color: ${backgroundHex}; color: ${forgroundHex};`}>
                        {renderImages}
                        <h3 style={`color: ${forgroundHex}; font-size: ${article.fontsizeH3}rem; font-weight: ${article.fontweightH3};`}>{article.title}</h3>
                        <h6>{article.teaser}</h6>
                        <div>
                            <small>
                                {util.asHumanReadable(article.published)}
                                {util.asHumanReadable(article.published) !== util.asHumanReadable(article.updatedDate) && <span class='text-muted'> / <i class='fas fa-undo' /> {util.asHumanReadable(article.updatedDate)}</span>}
                                &nbsp; /  <i class='far fa-folder-open' /> {article.category}
                                &nbsp; / &nbsp;
                                <span class={`badge badge-${util.getStatusClass(article.status)} p-2`}>
                                    {util.getStatus(article.status)}
                                </span>
                                &nbsp; / 
                                &nbsp;<a rel='noopener' target='_blank' href={`https://www.facebook.com/sharer.php?u=${shareLink}`}>
                                    <i class='fab fa-facebook'></i>
                                </a>
                                &nbsp;<a rel='noopener' target='_blank' href={`https://twitter.com/intent/tweet?url=${shareLink}`
                                    + `&text=${utilHtml.asUrlSafe(article.title)}.%20`
                                    + `${utilHtml.asUrlSafe(article.teaser || article.ingress)}`
                                    + `&via=${utilHtml.asUrlSafe(this.imageServer)}`
                                    + `&hashtags=${utilHtml.asUrlSafe(article.tags)}`}>
                                    <i class='fab fa-twitter'></i>
                                </a>
                                &nbsp;<a rel='noopener' target='_blank' href={`https://www.linkedin.com/shareArticle?mini=true`
                                    + `&url=${shareLink}`
                                    + `&summary=${utilHtml.asUrlSafe(article.title)}.%20`
                                    + `${utilHtml.asUrlSafe(article.teaser || article.ingress)}`
                                    + `&source=${utilHtml.asUrlSafe(this.imageServer)}`}>
                                    <i class='fab fa-linkedin-in'></i>
                                </a>
                                &nbsp;<a rel='noopener' target='_blank' href={`mailto:?subject=Tips: `
                                    + `${utilHtml.asUrlSafe(article.title)}`
                                    + `&body=Tips fra ${utilHtml.asUrlSafe(this.imageServer)}:%0D%0A%0D%0A`
                                    + `${utilHtml.asUrlSafe(utilHtml.uc(article.title))}%0D%0A%0D%0A`
                                    + `${utilHtml.asUrlSafe(article.teaser || article.ingress)}%0D%0A%0D%0A`
                                    + `Les mer: ${shareLink}`}>
                                    <i class='far fa-envelope'></i>
                                </a>
                                &nbsp; /                        
                                Ord: {util.wordCount(article.body)}
                                &nbsp; /                        
                                Lesetid: {util.readTime(article.body, 'no')}
                            </small>
                        </div>
                        <div class='mb-3'>
                            <small>
                                {Array.isArray(article.tags) && article.tags.map(tag =>
                                    <span class='badge badge-info mr-1'>{tag}</span>
                                )}
                            </small>
                        </div>
                        <div class='lead' id='ingressDisplay' dangerouslySetInnerHTML={{
                            __html: utilHtml.replaceMarked(
                                utilHtml.replaceDataTags(article.ingress, article)
                            ),
                        }}></div>
                    </div>
                    <div class='col-2 offset-1 pt-3' style={`background-color: ${backgroundHex}; color: ${forgroundHex};`}>
                        {renderImages}
                        <h5 style={`color: ${forgroundHex}; font-size: ${article.fontsizeH5}rem; font-weight: ${article.fontweightH5};`}>{article.title}</h5>
                        <h6>{article.teaser}</h6>
                        <div>
                            <small>
                                {util.asHumanReadable(article.published)}
                                {util.asHumanReadable(article.published) !== util.asHumanReadable(article.updatedDate) && <span class='text-muted'> / <i class='fas fa-undo' /> {util.asHumanReadable(article.updatedDate)}</span>}
                                &nbsp; /  <i class='far fa-folder-open' /> {article.category}
                                &nbsp; / &nbsp;
                                <span class={`badge badge-${util.getStatusClass(article.status)} p-2`}>
                                    {util.getStatus(article.status)}
                                </span>
                                &nbsp; / 
                                &nbsp;<a rel='noopener' target='_blank' href={`https://www.facebook.com/sharer.php?u=${shareLink}`}>
                                    <i class='fab fa-facebook'></i>
                                </a>
                                &nbsp;<a rel='noopener' target='_blank' href={`https://twitter.com/intent/tweet?url=${shareLink}`
                                    + `&text=${utilHtml.asUrlSafe(article.title)}.%20`
                                    + `${utilHtml.asUrlSafe(article.teaser || article.ingress)}`
                                    + `&via=${utilHtml.asUrlSafe(this.imageServer)}`
                                    + `&hashtags=${utilHtml.asUrlSafe(article.tags)}`}>
                                    <i class='fab fa-twitter'></i>
                                </a>
                                &nbsp;<a rel='noopener' target='_blank' href={`https://www.linkedin.com/shareArticle?mini=true`
                                    + `&url=${shareLink}`
                                    + `&summary=${utilHtml.asUrlSafe(article.title)}.%20`
                                    + `${utilHtml.asUrlSafe(article.teaser || article.ingress)}`
                                    + `&source=${utilHtml.asUrlSafe(this.imageServer)}`}>
                                    <i class='fab fa-linkedin-in'></i>
                                </a>
                                &nbsp;<a rel='noopener' target='_blank' href={`mailto:?subject=Tips: `
                                    + `${utilHtml.asUrlSafe(article.title)}`
                                    + `&body=Tips fra ${utilHtml.asUrlSafe(this.imageServer)}:%0D%0A%0D%0A`
                                    + `${utilHtml.asUrlSafe(utilHtml.uc(article.title))}%0D%0A%0D%0A`
                                    + `${utilHtml.asUrlSafe(article.teaser || article.ingress)}%0D%0A%0D%0A`
                                    + `Les mer: ${shareLink}`}>
                                    <i class='far fa-envelope'></i>
                                </a>
                                &nbsp; /                        
                                Ord: {util.wordCount(article.body)}
                                &nbsp; /                        
                                Lesetid: {util.readTime(article.body, 'no')}
                            </small>
                        </div>
                        <div class='mb-3'>
                            <small>
                                {Array.isArray(article.tags) && article.tags.map(tag =>
                                    <span class='badge badge-info mr-1'>{tag}</span>
                                )}
                            </small>
                        </div>
                        <div class='lead' id='ingressDisplay' dangerouslySetInnerHTML={{
                            __html: utilHtml.replaceMarked(
                                utilHtml.replaceDataTags(article.ingress, article)
                            ),
                        }}></div>
                    </div>
                </div>
            </div>
        );


        const renderedPreview = (
            <div class='col-12'>
                {renderImages}

                {language === 'no' && <div>
                    <h1>{article.title}</h1>
                    <h5>{article.teaser}</h5>
                    <div>
                        <small>
                            {util.asHumanReadable(article.published)}
                            {util.asHumanReadable(article.published) !== util.asHumanReadable(article.updatedDate) && <span class='text-muted'> / <i class='fas fa-undo' /> {util.asHumanReadable(article.updatedDate)}</span>}
                            &nbsp; /  <i class='far fa-folder-open' /> {article.category}
                            &nbsp; / &nbsp;
                            <span class={`badge badge-${util.getStatusClass(article.status)} p-2`}>
                                {util.getStatus(article.status)}
                            </span>
                            &nbsp; / 
                            &nbsp;<a rel='noopener' target='_blank' href={`https://www.facebook.com/sharer.php?u=${shareLink}`}>
                                <i class='fab fa-facebook'></i>
                            </a>
                            &nbsp;<a rel='noopener' target='_blank' href={`https://twitter.com/intent/tweet?url=${shareLink}`
                                + `&text=${utilHtml.asUrlSafe(article.title)}.%20`
                                + `${utilHtml.asUrlSafe(article.teaser || article.ingress)}`
                                + `&via=${utilHtml.asUrlSafe(this.imageServer)}`
                                + `&hashtags=${utilHtml.asUrlSafe(article.tags)}`}>
                                <i class='fab fa-twitter'></i>
                            </a>
                            &nbsp;<a rel='noopener' target='_blank' href={`https://www.linkedin.com/shareArticle?mini=true`
                                + `&url=${shareLink}`
                                + `&summary=${utilHtml.asUrlSafe(article.title)}.%20`
                                + `${utilHtml.asUrlSafe(article.teaser || article.ingress)}`
                                + `&source=${utilHtml.asUrlSafe(this.imageServer)}`}>
                                <i class='fab fa-linkedin-in'></i>
                            </a>
                            &nbsp;<a rel='noopener' target='_blank' href={`mailto:?subject=Tips: `
                                + `${utilHtml.asUrlSafe(article.title)}`
                                + `&body=Tips fra ${utilHtml.asUrlSafe(this.imageServer)}:%0D%0A%0D%0A`
                                + `${utilHtml.asUrlSafe(utilHtml.uc(article.title))}%0D%0A%0D%0A`
                                + `${utilHtml.asUrlSafe(article.teaser || article.ingress)}%0D%0A%0D%0A`
                                + `Les mer: ${shareLink}`}>
                                <i class='far fa-envelope'></i>
                            </a>
                            &nbsp; /                        
                            Ord: {util.wordCount(article.body)}
                            &nbsp; /                        
                            Lesetid: {util.readTime(article.body, 'no')}
                        </small>
                    </div>
                    <div class='mb-3'>
                        <small>
                            {Array.isArray(article.tags) && article.tags.map(tag =>
                                <span class='badge badge-info mr-1'>{tag}</span>
                            )}
                        </small>
                    </div>
                    <div class='lead' id='ingressDisplay' dangerouslySetInnerHTML={{
                        __html: utilHtml.replaceMarked(
                            utilHtml.replaceDataTags(article.ingress, article)
                        ),
                    }}></div>
                    <div id='bodyDisplay' dangerouslySetInnerHTML={{
                        __html: utilHtml.replaceMarked(
                            utilHtml.replaceDataTags(article.body, article)
                        ),
                    }}></div>
                </div>}

                {language === 'en' && <div>
                    <h1>{article.titleEn}</h1>
                    <h5>{article.teaserEn}</h5>
                    <div>
                        <small>
                            {util.asHumanReadable(article.published)}
                            {util.asHumanReadable(article.published) !== util.asHumanReadable(article.updatedDate) && <span class='text-muted'> / <i class='fas fa-undo' /> {util.asHumanReadable(article.updatedDate)}</span>}
                            &nbsp; /  <i class='far fa-folder-open' /> {article.category}
                            &nbsp; / &nbsp;
                            <span class={`badge badge-${util.getStatusClass(article.status)} p-2`}>
                                {util.getStatus(article.status)}
                            </span>
                            &nbsp; / 
                            &nbsp;<a rel='noopener' target='_blank' href={`https://www.facebook.com/sharer.php?u=${shareLink}`}>
                                <i class='fab fa-facebook'></i>
                            </a>
                            &nbsp;<a rel='noopener' target='_blank' href={`https://twitter.com/intent/tweet?url=${shareLink}`
                                + `&text=${utilHtml.asUrlSafe(article.title)}.%20`
                                + `${utilHtml.asUrlSafe(article.teaser || article.ingress)}`
                                + `&via=${utilHtml.asUrlSafe(this.imageServer)}`
                                + `&hashtags=${utilHtml.asUrlSafe(article.tags)}`}>
                                <i class='fab fa-twitter'></i>
                            </a>
                            &nbsp;<a rel='noopener' target='_blank' href={`https://www.linkedin.com/shareArticle?mini=true`
                                + `&url=${shareLink}`
                                + `&summary=${utilHtml.asUrlSafe(article.title)}.%20`
                                + `${utilHtml.asUrlSafe(article.teaser || article.ingress)}`
                                + `&source=${utilHtml.asUrlSafe(this.imageServer)}`}>
                                <i class='fab fa-linkedin-in'></i>
                            </a>
                            &nbsp;<a rel='noopener' target='_blank' href={`mailto:?subject=Tips: `
                                + `${utilHtml.asUrlSafe(article.title)}`
                                + `&body=Tips fra ${utilHtml.asUrlSafe(this.imageServer)}:%0D%0A%0D%0A`
                                + `${utilHtml.asUrlSafe(utilHtml.uc(article.title))}%0D%0A%0D%0A`
                                + `${utilHtml.asUrlSafe(article.teaser || article.ingress)}%0D%0A%0D%0A`
                                + `Les mer: ${shareLink}`}>
                                <i class='far fa-envelope'></i>
                            </a>
                            &nbsp; /                        
                            Words: {util.wordCount(article.bodyEn)}
                            &nbsp; /                        
                            Read time: {util.readTime(article.body, 'en')}
                        </small>
                    </div>
                    <div class='mb-3'>
                        <small>
                            {Array.isArray(article.tags) && article.tags.map(tag =>
                                <span class='badge badge-info mr-1'>{tag}</span>
                            )}
                        </small>
                    </div>
                    <div class='lead' id='ingressDisplay' dangerouslySetInnerHTML={{
                        __html: utilHtml.replaceMarked(
                            utilHtml.replaceDataTags(article.ingressEn, article)
                        ),
                    }}></div>
                    <div id='bodyDisplay' dangerouslySetInnerHTML={{
                        __html: utilHtml.replaceMarked(
                            utilHtml.replaceDataTags(article.bodyEn, article)
                        ),
                    }}></div>
                </div>}

                <hr />
                <h6>Notater til artikkelen (vises kun her i admin):</h6>
                <div id='notesDisplay' class='p-3 bg-secondary text-white font-italic' dangerouslySetInnerHTML={{
                    __html: utilHtml.replaceMarked(
                        utilHtml.replaceDataTags(article.notes, article)
                    ),
                }}></div>
            </div>
        );

        const renderedYoutube = (
            <div class='col-12'>
                <h5>Legg til Youtube video:</h5>
                <ul class='list-group'>
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((val, idx) =>
                        <li class={`list-group-item list-group-item-action flex-column align-items-start ${idx % 2 > 0 ? 'list-group-item-secondary' : ''}`}>
                            <div class='form-group row'>
                                <div class='col-5'>
                                    <label for='youtubeTitle'>Tittel</label>
                                    <input class='form-control' id='youtubeTitle'
                                        onInput={linkstate(that, `article.youtubeVideos.${val}.title`)}
                                        value={util.getString(article, 'youtubeVideos', val, 'title')}
                                    />
                                </div>
                                <div class='col-7'>
                                    <label for='youtubeText'>Tekst</label>
                                    <input class='form-control' id='youtubeText'
                                        onInput={linkstate(that, `article.youtubeVideos.${val}.text`)}
                                        value={util.getString(article, 'youtubeVideos', val, 'text')}
                                    />
                                </div>
                                <div class='col-8'>
                                    <label for='youtube'>YouTube URL</label>
                                    <input class='form-control' id='youtube'
                                        onInput={linkstate(that, `article.youtubeVideos.${val}.url`)}
                                        value={util.getString(article, 'youtubeVideos', val, 'url')}
                                        placeholder='Link til Youtube video'
                                    />
                                    <small id='youtubeHelp' class='form-text text-muted'>Youtube watch URL.</small>
                                </div>
                                <div class='col-4'>
                                    <label>&nbsp;</label>
                                    <button class='form-control btn btn-dark m-1'
                                        onClick={this.handleClickCode}
                                        data-content={`![${util.getString(article, 'youtubeVideos', val, 'title')}](${util.getString(article, 'youtubeVideos', val, 'url')} '${util.getString(article, 'youtubeVideos', val, 'text')}')\n`}>
                                        Sett inn video i tekst
                                    </button>
                                </div>
                            </div>
                        </li>
                    )}
                </ul>
            </div>
        );

        const renderedLinks = (
            <div class='col-12'>
                <h5>Legg til lenker:</h5>
                <ul class='list-group'>
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((val, idx) =>
                        <li class={`list-group-item list-group-item-action flex-column align-items-start ${idx % 2 > 0 ? 'list-group-item-secondary' : ''}`}>
                            <div class='form-group row'>
                                <div class='col-12'>
                                    <label for='linkTitle'>{idx + 1}: Tittel på siden du linker til</label>
                                    <input class='form-control' id='linkTitle'
                                        onInput={linkstate(that, `article.links.${val}.title`)}
                                        value={util.getString(article, 'links', val, 'title')}
                                        placeholder='Ie: Litt.no / Sorensos Blog'
                                    />
                                </div>
                                <div class='col-8'>
                                    <label for='link'>Link</label>
                                    <input class='form-control' id='link'
                                        onInput={linkstate(that, `article.links.${val}.url`)}
                                        value={util.getString(article, 'links', val, 'url')}
                                        placeholder='Link til side, eller e-postadresse.'
                                    />
                                </div>
                                <div class='col-4'>
                                    <label>&nbsp;</label>
                                    <button class='form-control btn btn-dark m-1'
                                        onClick={this.handleClickCode}
                                        data-content={`[${util.getString(article, 'links', val, 'title')}](${util.formatLink(util.getString(article, 'links', val, 'url'))})\n`}>
                                        Sett inn link i tekst
                                    </button>
                                </div>
                            </div>
                        </li>
                    )}
                </ul>
            </div>
        );

        const renderedMarkdown = (
            <div class='col-12'>
                <h5>Annen markdown som er kjekk å vite om:</h5>
                <div class='form-group row mt-4'>
                    <div class='col-sm-2'>
                        <label for='link'>Tabell</label>
                    </div>
                    <div class='col-sm-10'>
                        <input class='form-control'
                            onInput={linkstate(this, `markdown.tableTitle`)}
                            value={util.getString(this, 'state', 'markdown', 'tableTitle')}
                            placeholder='Tittel på tabellen...'
                        />
                        <textarea class='form-control'
                            onInput={linkstate(this, `markdown.tableCsv`)}
                            value={util.getString(this, 'state', 'markdown', 'tableCsv')}
                            placeholder='Klipp og lim fra Excel...'
                        />
                    </div>
                    <div class='offset-sm-2 col-sm-10'>
                        <button class='form-control btn btn-dark m-1'
                            onClick={this.handleClickCode}
                            data-content={this.markdownTable(
                                util.getString(this, 'state', 'markdown', 'tableCsv'),
                                util.getString(this, 'state', 'markdown', 'tableTitle'),
                            )}>
                            Sett inn tabell
                        </button>
                    </div>
                </div>

                <div class='form-group row mt-4'>
                    <div class='col-sm-2'>
                        <label for='link'>Sitat</label>
                    </div>
                    <div class='col-sm-10'>
                        <textarea class='form-control'
                            onInput={linkstate(this, `markdown.quote`)}
                            value={util.getString(this, 'state', 'markdown', 'quote')}
                            placeholder='Skriv inn sitat...'
                        />
                    </div>
                    <div class='offset-sm-2 col-sm-10'>
                        <button class='form-control btn btn-dark m-1'
                            onClick={this.handleClickCode}
                            data-content={this.markdownQuote(util.getString(this, 'state', 'markdown', 'quote'))}>
                            Sett inn sitat
                        </button>
                    </div>
                </div>

                <div class='form-group row mt-4'>
                    <div class='col-sm-2'>
                        <label for='link'>Kode</label>
                    </div>
                    <div class='col-sm-10'>
                        <select class='form-control'
                            onInput={linkstate(this, `markdown.codeLanguage`)}
                            value={util.getString(this, 'state', 'markdown', 'codeLanguage')}
                        >
                            <option value=''>-- velg språk ---</option>
                            <option>arduino</option>
                            <option>bash</option>
                            <option>c++</option>
                            <option>css</option>
                            <option>excel</option>
                            <option>diff</option>
                            <option>go</option>
                            <option>html</option>
                            <option>javascript</option>
                            <option>json</option>
                            <option>markdown</option>
                            <option>perl</option>
                            <option>php</option>
                            <option>python</option>
                            <option>rust</option>
                            <option>sql</option>
                            <option>yaml</option>
                        </select>
                        <textarea class='form-control'
                            onInput={linkstate(this, `markdown.code`)}
                            value={util.getString(this, 'state', 'markdown', 'code')}
                            placeholder='Skriv inn kodelinjene dine...'
                        />
                    </div>
                    <div class='offset-sm-2 col-sm-10'>
                        <button class='form-control btn btn-dark m-1'
                            onClick={this.handleClickCode}
                            data-content={this.markdownCode(util.getString(this, 'state', 'markdown', 'code'), util.getString(this, 'state', 'markdown', 'codeLanguage'))}>
                            Sett inn koden
                        </button>
                    </div>
                </div>
            </div>
        );

        const apiUrl = `/api/fileupload/?category=${article.category || 'no-category'}`
            + `&title=${util.htmlIdSafe(article.title) || 'no-title'}`;
        const renderedImages = (
            <div class='col-12'>

                <h3>Bilder i artikkelen:</h3>
                <ul class='list-group mb-4'>
                    {article && (!article.img || article.img.length <= 0) && (
                        <div class='col-12 text-center text-muted'>
                            <h1><i class='fas fa-images'></i> Ingen bilder i artikkelen</h1>
                            <h5>Slik legger du til bilder:</h5>
                            <ul>
                                <li>Last opp nye bilder med bildeopplastingen under.</li>
                                <li>Søk etter bilder du allerede har i arkivet.</li>
                            </ul>
                            <br /><br /><br /><br /><br />
                        </div>
                    )}
                    {article && article.img && article.img.map((img, idx) => {
                        const isImg = isImage(img.ext || img.src);
                        const ext = img.ext ? img.ext.replace(/\./, '') : '';

                        return (
                            <li class={`list-group-item list-group-item-action flex-column align-items-start ${idx % 2 > 0 ? 'list-group-item-secondary' : ''}`}>
                                <div class='d-flex w-100 justify-content-between'>
                                    <div>
                                        <h5 class='m-0'>{img.name}</h5>
                                        <span class='mb-1'><small>{img.src}</small></span>
                                    </div>
                                    <small>{util.formatBytes(img.bytes || util.getString(img, 'stats', 'size'), 2)}</small>
                                    <button class='btn btn-danger btn-sm' data-image={idx} onClick={handleRemoveImageClick}>X</button>
                                </div>
                                <div class='d-flex w-100 justify-content-between'>
                                    {isImg && <p>{img.src && <img src={`https://${imageServer}/150x/${imagePath}/${img.src}`} style='max-height: 150px;'  class='img-fluid' onError={this.handleImageErrored} />}</p>}
                                    {!isImg && ext && <div class='display-4 text-muted'>
                                        {ext === 'gpx' ? <i class='fas fa-map-marked-alt' /> : <i class={`fas fa-file-${ext}`} />}
                                    </div>}
                                    <small>
                                        <button class='btn btn-sm m-1' onClick={this.handleClickCode} data-content={`[${img.title|| ''}](https://${imageServer}/original/${imagePath}/${img.src} '${img.text || ''}')\n`}>
                                            <i class='fas fa-image'></i> Org
                                        </button>
                                        {isImg && <button class='btn btn-sm m-1' onClick={this.handleClickCode} data-content={`![${img.title|| ''}](https://${imageServer}/800x/${imagePath}/${img.src} '${img.text || ''}')\n`}>
                                            <i class='fas fa-image'></i> Image
                                        </button>}
                                        {isImg && <button class='btn btn-sm m-1' onClick={this.handleClickCode} data-content={`[![${img.title|| ''}](https://${imageServer}/800x/${imagePath}/${img.src}#nolink '${img.text || ''}')](${img.url})\n`}>
                                            <i class='fas fa-image'></i> Image w/link
                                        </button>}
                                        {isImg && <button class='btn btn-sm m-1' onClick={this.handleClickCode} data-content={`![${img.title|| ''}](https://${imageServer}/1920x/${imagePath}/${img.src}#fullwidth '${img.text || ''}')\n`}>
                                            <i class='fas fa-link'></i> Full width
                                        </button>}
                                        {isImg && <button class='btn btn-sm m-1' onClick={this.handleClickCode} data-content={`[![${img.title|| ''}](https://${imageServer}/800x/${imagePath}/${img.src}#card '${img.text || ''}')](${img.url})\n`}>
                                            <i class='fas fa-link'></i> Link
                                        </button>}
                                        {isImg && <button class='btn btn-sm m-1' onClick={this.handleClickCode} data-content={`![${img.title|| ''}](https://${imageServer}/800x/${imagePath}/${img.src}#card '${img.text || ''}')\n`}>
                                            <i class='fas fa-file-image'></i> Card
                                        </button>}
                                        {isImg && <button class='btn btn-sm m-1' onClick={this.handleClickCode} data-content={`![${img.title|| ''}](https://${imageServer}/800x/${imagePath}/${img.src}#card2 '${img.text || ''}')\n`}>
                                            <i class='far fa-image'></i> Card 2
                                        </button>}
                                        {isImg && <button class='btn btn-sm m-1' onClick={this.handleClickCode} data-content={`![${img.title|| ''}](https://${imageServer}/800x/${imagePath}/${img.src}#plain '${img.text || ''}')\n`}>
                                            <i class='far fa-image'></i> Plain
                                        </button>}
                                        {isImg && <button class='btn btn-sm m-1' onClick={this.handleClickCode} data-content={`![${img.title|| ''}](https://${imageServer}/800x/${imagePath}/${img.src}#circle '${img.text || ''}')\n`}>
                                            <i class='far fa-image'></i> Circle
                                        </button>}
                                        {isImg && <button class='btn btn-sm m-1' onClick={this.handleClickCode} data-content={`![${img.title|| ''}](https://${imageServer}/800x/${imagePath}/${img.src}#nolink '${img.text || ''}')\n`}>
                                            <i class='far fa-image'></i> No link
                                        </button>}
                                        {isImg && <button class='btn btn-sm m-1' onClick={this.handleClickCode} data-content={`<h5>Detaljer om bildet</h5>
<ul>
<li><i class='fas fa-camera'></i> [:img.${idx}.exif.model]</li>
<li>Objektiv: [:img.${idx}.exif.lensModel]</li>
<li>Blender: f/[:img.${idx}.exif.fNumber]</li>
<li>Brennvidde: [:img.${idx}.exif.focalLength] mm</li>
<li>Eksponering: [:img.${idx}.exif.exposureTime] sec</li>
<li>ISO: [:img.${idx}.exif.photographicSensitivity]</li>
<li>Oppløsning: [:img.${idx}.features.width] x [:img.${idx}.features.height]px ([:img.${idx}.stats.size size])</li>
<li><i class='fas fa-clock'></i> [:img.${idx}.exif.dateTimeOriginal date]</li>
<li><i class='fas fa-mountain'></i> [:img.${idx}.exif.gpsAltitude] moh</li>
<li><i class='fas fa-location-arrow'></i> [:img.${idx}.exif.lat position], [:img.${idx}.exif.lng position]</li>
<li><i class='fas fa-print'></i> [:img.${idx}.features.print+size dim] cm</li>
</ul>
`}><i class='fas fa-info-circle'></i> Bildeinfo
                                        </button>}
                                        <button class='btn btn-sm m-1' onClick={this.handleClickCode} data-content={`@[:img.${idx}.exif.lat],[:img.${idx}.exif.lng]\n`}>
                                            <i class='fas fa-location-arrow'></i> GPS
                                        </button>
                                        {ext === 'gpx' && <button class='btn btn-sm m-1' onClick={this.handleClickCode} data-content={`{{widget name=map fileIdx=${idx}}}\n`}>
                                            <i class='fas fa-location-arrow'></i> Widget map
                                        </button>}
                                        <button class='btn btn-sm m-1' onClick={this.handleClickCode} data-content={`**Dette bildet er tilsalgs. Send meg en _[e-post](mailto:sorenso@gmail.com?subject=Henvendelse%20ang%20bilde:%20[:img.${idx}.src])_ eller ta kontakt på _[Facebook](http://facebook.com/sorenso)_ om du er interessert.**\n`}>
                                            <i class='fas fa-shopping-cart'></i> Kjøp
                                        </button>
                                    </small>
                                    <br />

                                </div>
                                <div class='d-flex w-100 justify-content-between row'>
                                    {idx === 0 && <div class='col-12 alert alert-primary' role='alert'>
                                        Bilde 1 blir brukt som hovedbilde i artikkelen.
                                    </div>}

                                    <div class='form-group col-2'>
                                        <label for={`img${idx}Title`}>Tittel</label>
                                    </div>
                                    <div class='form-group col-10'>
                                        <input type='text' class='form-control' id={`img${idx}Title`}
                                            onInput={linkstate(that, `article.img.${idx}.title`)}
                                            value={article.img[idx].title} />
                                    </div>

                                    <div class='form-group col-2'>
                                        <label for={`img${idx}URL`}>URL</label>
                                    </div>
                                    <div class='form-group col-10'>
                                        <input type='text' class='form-control' id={`img${idx}URL`}
                                            onInput={linkstate(that, `article.img.${idx}.url`)}
                                            value={article.img[idx].url} />
                                    </div>

                                    <div class='form-group col-2'>
                                        <label for={`img${idx}Text`}>Tekst</label>
                                    </div>
                                    <div class='form-group col-10'>
                                        <textarea class='form-control' id={`img${idx}Text`}
                                            onInput={linkstate(that, `article.img.${idx}.text`)}
                                            value={article.img[idx].text} />
                                    </div>

                                </div>
                            </li>
                        );
                    })}
                </ul>

                <h3>Last opp nytt bilde:</h3>
                <div class='form-group mb-4'>
                    <ImageUpload
                        apiUrl={apiUrl}
                        apiServer={that.props.apiServer}
                        jwtToken={that.props.jwtToken}
                        handleAddImage={handleAddImage}
                    />
                </div>

                <h3>Bildearkivet:</h3>
                <div class='col-12'>
                    <div class='d-flex justify-content-center'>
                        <div class='col-10 mb-2'>
                            <input type='text' class='form-control' placeholder='Søk etter bilder' name='q'
                                onKeypress={e => handleImageInput(e, 54)}
                            />
                        </div>
                        <div class='col-2'>
                            <button class='btn btn-success' onclick={e => handleImageSubmit(e, 54)}><i class='fas fa-search'></i> Søk</button>
                        </div>

                    </div>
                </div>
                <div class='row mb-4'>
                    <div class='col-1 text-right text-muted'>
                        {Object.keys(filterQuery).length > 0 && 'Filters:'}
                    </div>
                    <div class='col-12'>
                        {Object.keys(filterQuery).map(key =>
                            <span class={`mr-1 badge badge-danger`}
                                data-name={key}
                                data-value={filterQuery[key]}
                                onClick={handleImageTagClick}
                            >
                                {filterQuery[key]}
                                <i class='ml-1 fas fa-times-circle'></i>
                            </span>
                        )}
                    </div>
                    {imglist.length <= 0 && (
                        <div class='col-12 text-center text-muted'>
                            <h1><i class='fas fa-images'></i> Ingen bilder å vise...</h1>
                            <h5>Du kan forsøke å søke etter stikkord i bildene.</h5>
                            Feks: 'person', 'norway', 'kolsås', 'dog', 'ski'
                            <br /><br /><br /><br /><br />
                        </div>
                    )}
                    {imglist.map((img, idx) => {
                        const isImg = isImage(img.ext || img.src);
                        const ext = img.ext ? img.ext.replace(/\./, '') : '';

                        return (
                            <div class='col-2 p-1'>
                                {isImg && <img src={`https://${imageServer}/150x/${imagePath}/${img.src}`} class='img-fluid' data-idx={idx} onclick={handleImglistClick} onError={this.handleImageErrored}/>}
                                {!isImg && ext && <div class='display-4 text-muted'>
                                    {ext === 'gpx' ? <i class='fas fa-map-marked-alt' /> : <i class={`fas fa-file-${ext}`} />}
                                </div>}
                                <small class='text-muted'>
                                    {img.name}
                                </small>
                            </div>
                        );
                    })}
                </div>
            </div>
        );

        const renderedMeta = (
            <div class='col-12'>
                <div class='row'>
                    <div class='col-12'>
                        <div class='form-group'>
                            <label for='publishedInput'>Published</label>
                            <input type='text' class='form-control' id='publishedInput' placeholder='Publiseringsdato'
                                name='published'
                                onInput={handleInput}
                                value={article.published} />
                        </div>
                    </div>
                    <div class='col-12'>
                        <div class='form-group'>
                            <label for='youtubeInput'>Youtube link</label>
                            <input type='text' class='form-control' id='youtubeInput' placeholder='Youtube link'
                                name='youtube'
                                onInput={handleInput}
                                value={article.youtube} />
                        </div>
                    </div>
                    <div class='col-12'>
                        <div class='form-group'>
                            <label for='tagsInput'>Tags</label>
                            <input type='text' class='form-control' id='tagsInput' placeholder='Tags'
                                name='tagSearch'
                                onInput={e => this.handleTagsInput(e, handleInput)}
                                onKeydown={e => this.handleKeydown(e, handleInput, taglist)}
                                value={currentTag || article.tagSearch} />

                            {Array.isArray(taglist) && taglist.map((tag, idx) =>
                                <span class={`badge badge-${currentTagIdx === idx ? 'warning' : 'light'} mr-1`}
                                    onClick={e => this.handleTagAdd(e, handleInput, tag.title)}
                                >{tag.title} <small class='text-muted'>({tag.count})</small> <i class='fas fa-plus'></i></span>
                            )}

                            {Array.isArray(article.tags) && article.tags.map(tag =>
                                <span class='badge badge-info mr-1'>{tag} <i class='fas fa-times-circle'
                                    onClick={e => this.handleTagRemove(e, handleInput, tag)}
                                ></i></span>
                            )}
                            <div class='mt-3 mb-3'>
                                <small>
                                    {Array.isArray(article.classifiedWords) ? <h5>Language classification</h5> : ''}
                                    {Array.isArray(article.classifiedWords) && article.classifiedWords.map(word =>
                                        <span class='badge badge-success mr-1'
                                            onClick={e => this.handleTagAdd(e, handleInput, word)}
                                        ><i class='fas fa-comment-dots mr-1'></i> {word} <i class='fas fa-plus'></i></span>
                                    )}
                                </small>
                                <small>
                                    {Array.isArray(article.relevantWords) ? <h5>Language processing</h5> : ''}
                                    {Array.isArray(article.relevantWords) && article.relevantWords.map(word =>
                                        <span class='badge badge-danger mr-1'
                                            onClick={e => this.handleTagAdd(e, handleInput, word)}
                                        ><i class='fas fa-comment-dots mr-1'></i> {word} <i class='fas fa-plus'></i></span>
                                    )}
                                </small>
                            </div>
                            <div class='mb-3'>
                                <small>
                                    {Array.isArray(article.img) ? <h5>Image recognition</h5> : ''}
                                    {Array.isArray(article.img) && article.img.map(img => {
                                        let geoInfo = [];
                                        let geoInfoExtra = [];
                                        util.geoAddressFields().map(key => {
                                            const geoData = util.getString(img, 'geo', 'address', key);
                                            if (geoData) {
                                                geoInfo.push(geoData);
                                                const geoDataExtra = util.geoAddressGetExtraTags(key);
                                                if (geoDataExtra) {
                                                    geoInfoExtra = geoInfoExtra.concat(geoDataExtra);
                                                }
                                            }
                                        });
                                        const geoDisplayName = util.getString(img, 'geo', 'display_name');
                                        if (geoDisplayName) {
                                            geoDisplayName.split(', ').map(val => {
                                                if (val && geoInfo.indexOf(val) === -1) {
                                                    geoInfo.push(val);
                                                }
                                            })
                                        }
                                        geoInfo = util.asUniqArray(geoInfo);

                                        return (
                                            <div class='row mb-3'>
                                                <div class='col-4'>
                                                    {img.src && <img src={`${this.imageServer}/pho/${img.src}?w=500`} class='img-fluid' onError={this.handleImageErrored} />}
                                                </div>
                                                <div class='col-8'>
                                                    {geoInfo.map(info =>
                                                        <span class='badge badge-primary mr-1'
                                                            onClick={e => this.handleTagAdd(e, handleInput, info)}
                                                        >
                                                            <i class='fas fa-map-marker-alt mr-1'></i> {info} <i class='fas fa-plus'></i>
                                                        </span>
                                                    )}
                                                    {geoInfoExtra.map(info =>
                                                        <span class='badge badge-danger mr-1'
                                                            onClick={e => this.handleTagAdd(e, handleInput, info)}
                                                        >
                                                            <i class='fas fa-map-marker-alt mr-1'></i> {info} <i class='fas fa-plus'></i>
                                                        </span>
                                                    )}
                                                    <br />

                                                    {Array.isArray(img.predictions) && img.predictions.map(pre =>
                                                        <span class='badge badge-secondary mr-1'
                                                            onClick={e => this.handleTagAdd(e, handleInput, pre.className)}
                                                        ><i class='fas fa-tag mr-1'></i> {pre.className} <i class='fas fa-plus'></i></span>
                                                    )}
                                                    {Array.isArray(img.predictionsCocoSsd) && img.predictionsCocoSsd.map(pre =>
                                                        <span class='badge badge-dark mr-1'
                                                            onClick={e => this.handleTagAdd(e, handleInput, pre.class)}
                                                        ><i class='fas fa-tag mr-1'></i> {pre.class} <i class='fas fa-plus'></i></span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );

        return (
            <div class='container-fluid col-12 vh-100'>
                <div class='row'>
                    <div class='col-12 col-md-6 mb-2 mb-md-0 overflow-auto vh-100' id='editColumn'>
                        <Edit
                            article={article}
                            catlist={catlist}
                            handleClickBack={handleClickBack}
                            handleClickSave={handleClickSave}
                            handleClickNew={handleClickNew}
                            handleInput={handleInput}
                            handleInputRaw={handleInputRaw}
                            handleAddImage={handleAddImage}
                            handleRemoveImageClick={handleRemoveImageClick}
                            handleTextareaInput={handleTextareaInput}
                            previewJwtToken={previewJwtToken}
                            sessionEmail={sessionEmail}
                            imageServer={imageServer}
                            imagePath={imagePath}
                            styles={styles}
                            messages={messages}
                        />
                    </div>
                    <div class='col-12 col-md-6 mt-2 mt-md-0 overflow-auto vh-100' id='previewColumn'>
                        <div class='row'>
                            <Menu
                                article={article}
                                handleMenuClick={this.handleMenuClick}
                                currentMenu={currentMenu}
                            />
                            {currentMenu === 'preview' && renderedPreview}
                            {currentMenu === 'frontpagepreview' && renderedFrontpagePreview}
                            {currentMenu === 'images' && renderedImages}
                            {currentMenu === 'youtube' && renderedYoutube}
                            {currentMenu === 'links' && renderedLinks}
                            {currentMenu === 'meta' && renderedMeta}
                            {currentMenu === 'markdown' && renderedMarkdown}
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}
