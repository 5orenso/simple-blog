import { h, Component } from 'preact';

import linkstate from 'linkstate';

import ImageUpload from './imageUpload';
import MessagesLite from './messagesLite';

import Edit from './article/edit';
import Preview from './article/preview';
import FrontpagePreview from './article/frontpagePreview';
import Menu from './article/menu';
import Youtube from './article/youtube';
import Links from './article/links';
import Meta from './article/meta';
import Markdown from './article/markdown';
import Images from './article/images';

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
    gallery: ['class', 'style', 'wrapper-class', 'wrapper-inner-class', 'class-photo', 'skip-background-images', 'class-photo-img', 'img-wrapper-class', 'start', 'end'],
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

        const shareLink = `${this.imageServer}/${utilHtml.asLinkPart(article.category)}/${utilHtml.asLinkPart(article.title)}/${article.id}`;
// {/* <div class='rounded-lg' style={`background-color: ${backgroundHex};`}>
//                                     <h1 style={`color: ${forgroundHex}; font-size: ${article.fontsize}em; font-weight: ${article.fontweight};`}>{article.title}</h1>
//                                 </div> */}

        const apiUrl = `/api/fileupload/?category=${article.category || 'no-category'}`
            + `&title=${util.htmlIdSafe(article.title) || 'no-title'}`;

        return (
            <div class='container-fluid col-12 vh-100'>
                <div class='row'>
                    <div class='col-12 col-md-6 mb-2 mb-md-0 overflow-auto vh-100' id='editColumn'>
                        <Edit
                            article={article}
                            catlist={catlist}
                            language={language}
                            toggleLanguageMenu={this.toggleLanguageMenu}
                            handleClickBack={handleClickBack}
                            handleClickSave={handleClickSave}
                            handleClickNew={handleClickNew}
                            handleInput={handleInput}
                            handleInputRaw={handleInputRaw}
                            handleAddImage={handleAddImage}
                            handleRemoveImageClick={handleRemoveImageClick}
                            handleTextareaInput={handleTextareaInput}
                            handleTextareaFocus={this.handleTextareaFocus}
                            previewJwtToken={previewJwtToken}
                            sessionEmail={sessionEmail}
                            imageServer={imageServer}
                            imagePath={imagePath}
                            serverName={this.serverName}
                            styles={styles}
                            messages={messages}
                            setColorToValue={this.setColorToValue}
                            setColorToHex={this.setColorToHex}
                            translateToEnglish={this.translateToEnglish}

                            backgroundHex={backgroundHex}
                            backgroundHexR={backgroundHexR}
                            backgroundHexG={backgroundHexG}
                            backgroundHexB={backgroundHexB}
                            forgroundHex={forgroundHex}
                            forgroundHexR={forgroundHexR}
                            forgroundHexG={forgroundHexG}
                            forgroundHexB={forgroundHexB}
                            fontsizeH1={fontsizeH1}
                            fontweightH1={fontweightH1}
                            fontsizeH3={fontsizeH3}
                            fontweightH3={fontweightH3}
                            fontsizeH5={fontsizeH5}
                            fontweightH5={fontweightH5}
                        />
                    </div>
                    <div class='col-12 col-md-6 mt-2 mt-md-0 overflow-auto vh-100' id='previewColumn'>
                        <div class='row'>
                            <Menu
                                article={article}
                                handleMenuClick={this.handleMenuClick}
                                currentMenu={currentMenu}
                            />
                            {currentMenu === 'preview' && <Preview
                                article={article}
                                language={language}
                                imageServer={imageServer}
                                imagePath={imagePath}
                            />}
                            {currentMenu === 'frontpagepreview' && <FrontpagePreview
                                article={article}
                                language={language}
                                imageServer={imageServer}
                                imagePath={imagePath}
                                backgroundHex={backgroundHex}
                                forgroundHex={forgroundHex}
                            />}
                            {currentMenu === 'images' && <Images
                                that={that}
                                article={article}
                                imglist={imglist}
                                handleRemoveImageClick={handleRemoveImageClick}
                                handleClickCode={this.handleClickCode}
                                imageServer={imageServer}
                                imagePath={imagePath}
                                apiUrl={apiUrl}
                                filterQuery={filterQuery}
                                handleAddImage={handleAddImage}
                                handleImageInput={handleImageInput}
                                handleImageSubmit={handleImageSubmit}
                                handleImglistClick={handleImglistClick}
                                handleImageTagClick={handleImageTagClick}
                            />}
                            {currentMenu === 'youtube' && <Youtube
                                that={that}
                                article={article}
                                handleClickCode={this.handleClickCode}
                            />}
                            {currentMenu === 'links' && <Links
                                that={that}
                                article={article}
                                handleClickCode={this.handleClickCode}                            
                            />}
                            {currentMenu === 'meta' && <Meta
                                article={article}
                                imageServer={imageServer}
                                handleInput={handleInput}
                                handleTagAdd={this.handleTagAdd}
                                handleTagRemove={this.handleTagAdd}
                                handleTagsInput={this.handleTagsInput}
                                handleKeydown={this.handleKeydown}
                                currentTag={currentTag}
                                taglist={taglist}
                            />}
                            {currentMenu === 'markdown' && <Markdown
                                handleClickCode={this.handleClickCode}
                                markdownTable={this.markdownTable}
                                markdownQuote={this.markdownQuote}
                                markdownCode={this.markdownCode}
                            />}
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}
