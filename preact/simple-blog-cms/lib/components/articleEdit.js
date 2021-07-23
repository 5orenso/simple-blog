import { h, Component } from 'preact';

import linkstate from 'linkstate';

import ImageUpload from './imageUpload';
import MessagesLite from './messagesLite';

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
};
const debug = false;
const editMode = 'textarea'; // div
const imageWidth = 150;

const statusList = [
    { value: 1, title: 'I arbeid' },
    { value: 2, title: 'Live' },
];

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

    render(props) {
        const { currentMenu, currentTagIdx, currentTag, toggleDropdown } = this.state;
        const that = props.that;
        const { imageServer, imagePath } = props;
        const previewJwtToken = props.previewJwtToken;
        const styles = props.styles;
        const messages = props.messages;
        const article = props.article;
        const sessionEmail = props.sessionEmail;
        const handleInput = props.handleInput;
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
        const renderImages = images.slice(0, 1).map(img => {
            if (img.src) {
                return (
                    <img src={`https://${imageServer}/800x/${imagePath}/${img.src}`} alt='' title='' class='img-fluid' onError={this.handleImageErrored} />
                );
            }
        });

        const renderedMenu = (
            <nav class='nav nav-pills nav-fill mb-3 sticky-top bg-light'>
                <a class={`nav-item nav-link ${currentMenu === 'preview' ? 'active' : ''}`} href='#'
                    onClick={this.handleMenuClick} data-menu='preview'><i class='fas fa-eye'></i> Forhåndsvisning</a>
                <a class={`nav-item nav-link ${currentMenu === 'images' ? 'active' : ''}`} href='#'
                    onClick={this.handleMenuClick} data-menu='images'><i class='fas fa-images'></i> Bilder ({imagesTotal})</a>
                <a class={`nav-item nav-link ${currentMenu === 'youtube' ? 'active' : ''}`} href='#'
                    onClick={this.handleMenuClick} data-menu='youtube'><i class='fas fa-video'></i> Youtube</a>
                <a class={`nav-item nav-link ${currentMenu === 'links' ? 'active' : ''}`} href='#'
                    onClick={this.handleMenuClick} data-menu='links'><i class='fas fa-link'></i> Lenker</a>
                <a class={`nav-item nav-link ${currentMenu === 'meta' ? 'active' : ''}`} href='#'
                    onClick={this.handleMenuClick} data-menu='meta'><i class='fas fa-tags'></i> Meta</a>
                <a class={`nav-item nav-link ${currentMenu === 'markdown' ? 'active' : ''}`} href='#'
                    onClick={this.handleMenuClick} data-menu='markdown'><i class='fas fa-code'></i> Annet</a>
            </nav>
        );

        const renderedEditArticle = (
            <div class='row bg-secondary'>
                <div class='col-12 sticky-top d-flex justify-content-between'>
                    <div class='col-3'>
                        <button type='button' class='btn btn-warning mr-2' onclick={handleClickBack}>
                            <span class='d-sm-none'><i class='fas fa-arrow-left'></i></span>
                            <span class='d-none d-sm-block'><i class='fas fa-arrow-left'></i> Tilbake</span>
                        </button>
                    </div>
                    <div class='col-6 text-center'>
                        <button type='submit' class='btn btn-success mr-2' onClick={handleClickSave}>
                            <span class='d-sm-none'><i class='fas fa-save'></i></span>
                            <span class='d-none d-sm-block'><i class='fas fa-save'></i> Lagre</span>
                        </button>
                        <a class='btn btn-primary' target='_blank' href={`${this.serverName}/v2/${util.htmlIdSafe(article.category || 'no-category')}/${util.htmlIdSafe(article.title || 'no-title')}/${article.id}?previewJwtToken=${previewJwtToken}`}>
                            <span class='d-sm-none'><i class='fas fa-external-link-alt'></i></span>
                            <span class='d-none d-sm-block'><i class='fas fa-external-link-alt'></i> Preview</span>
                        </a>
                    </div>
                    <div class='col-3'>
                        <button class='btn btn-info float-right ml-2' onClick={e => handleClickNew(e, {
                            author: authorDefault,
                            category: catlist[0].url,
                            categoryId: catlist[0].id,
                        })}>
                            <span class='d-sm-none'><i class='fas fa-plus'></i></span>
                            <span class='d-none d-sm-block'><i class='fas fa-plus'></i> Ny artikkel</span>
                        </button>
                    </div>
                </div>

                <div class='col-12 fixed-bottom'>
                    <small>
                        <MessagesLite styles={styles} messages={messages} />
                    </small>
                </div>


                <div class='col-2'>
                    <div class='form-group'>
                        <label for='statusInput' class='text-white-50'>Status</label>
                        <div class='dropdown'>
                            <button class='btn btn-light dropdown-toggle'
                                type='button'
                                onClick={e => this.handleDropdownClick(e, 'status')}
                            >
                                {article.status ? statusList.find(x => x.value === article.status).title : 'Velg status'}
                            </button>
                            <div class={`dropdown-menu ${toggleDropdown.status ? 'show' : ''}`} style='z-index: 1200;'>
                                <a class='dropdown-item' href='#'
                                    data-key='status'
                                    data-val=''
                                    onClick={e => {
                                        this.handleDropdownClick(e, 'status');
                                        handleInput(e, {
                                            name: 'status',
                                            value: 0,
                                        });
                                    }}
                                >
                                    Alle
                                </a>
                                {statusList.map(status =>
                                    <a class={`dropdown-item ${article.status === status.value ? 'text-success' : ''}`} href='#'
                                        data-key='status'
                                        data-val={status.title}
                                        onClick={e => {
                                            this.handleDropdownClick(e, 'status');
                                            handleInput(e, {
                                                name: 'status',
                                                value: status.value,
                                            });
                                        }}
                                    >
                                        {status.title}
                                    </a>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
                <div class='col-4'>
                    <div class='form-group'>
                        <label for='categoryInput' class='text-white-50'>Kategori</label>
                        <div class='dropdown'>
                            <button class='btn btn-light dropdown-toggle'
                                type='button'
                                onClick={e => this.handleDropdownClick(e, 'category')}
                            >
                                {article.category ? article.category : 'Velg kategori'}
                            </button>
                            <div class={`dropdown-menu ${toggleDropdown.category ? 'show' : ''}`} style='z-index: 1200;'>
                                <a class='dropdown-item' href='#'
                                    data-key='category'
                                    data-val=''
                                    onClick={e => {
                                        this.handleDropdownClick(e, 'category');
                                        handleInput(e, {
                                            name: 'category',
                                            value: '',
                                        });
                                        handleInput(e, {
                                            name: 'categoryId',
                                            value: 0,
                                        });
                                    }}
                                >
                                    Alle
                                </a>
                                {catlist.map(cat =>
                                    <a class={`dropdown-item ${article.category === cat.title ? 'text-success' : ''} ${!cat.type && !cat.menu ? 'text-muted font-weight-lighter' : ''}`} 
                                        href='#'
                                        data-key='category'
                                        data-val={cat.title}
                                        onClick={e => {
                                            this.handleDropdownClick(e, 'category');
                                            handleInput(e, {
                                                name: 'category',
                                                value: cat.title,
                                            });
                                            handleInput(e, {
                                                name: 'categoryId',
                                                value: cat.id,
                                            });
                                        }}
                                    >
                                        {cat.menu > 0 && <i class='fas fa-bars mr-2' />}
                                        {[2, 3, 4, 8].indexOf(cat.type) !== -1 && <i class='fas fa-ad mr-2' />}
                                        {[1].indexOf(cat.type) !== -1 && <i class='fas fa-cogs mr-2' />}
                                        {[5].indexOf(cat.type) !== -1 && <i class='fas fa-image mr-2' />}
                                        {[6].indexOf(cat.type) !== -1 && <i class='fas fa-link mr-2' />}
                                        {[7].indexOf(cat.type) !== -1 && <i class='fas fa-download mr-2' />}
                                        {!cat.type && !cat.menu && <i class='fas fa-question mr-2' />}
                                        {cat.title}
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div class='col-2'>
                    <div class='form-group'>
                        <label for='sortInput' class='text-white-50'>
                            Sortering <i class='fas fa-sort-numeric-up-alt'></i>
                        </label>
                        <input type='text' class='form-control' id='sortInput' placeholder=''
                            name='sort'
                            onInput={handleInput}
                            value={article.sort} />
                    </div>
                </div>
                <div class='col-4'>
                    <div class='form-group'>
                        <label for='authorInput' class='text-white-50'>Forfatter</label>
                        <input type='text' class='form-control' id='authorInput' placeholder='Forfatter'
                            name='author'
                            onInput={handleInput}
                            value={article.author} />
                    </div>
                </div>

                <div class='col-12 d-flex flex-column'>
                    <div class='form-group'>
                        <label for='titleInput' class='text-white-50'>Tittel</label>
                        <input type='text' class='form-control' id='titleInput' placeholder='Tittel'
                            name='title'
                            onInput={handleInput}
                            value={article.title} />
                    </div>
                    <div class='form-group'>
                        <label for='urlInput' class='text-white-50'>URL</label>
                        <input type='text' class='form-control' id='urlInput' placeholder='Link'
                            name='url'
                            onInput={handleInput}
                            value={article.url} />
                    </div>
                    <div class='form-group'>
                        <label for='teaserInput' class='text-white-50'>Teaser</label>
                        <input type='text' class='form-control' id='teaserInput' placeholder='Teaser'
                            name='teaser'
                            onInput={handleInput}
                            value={article.teaser} />
                    </div>
                    <div class='form-group'>
                        <label for='ingressInput' class='text-white-50'>Ingress</label>
                        <textarea name='ingress' class={`form-control`} id='ingressInput' rows='3'
                            onInput={handleTextareaInput}
                            onFocus={this.handleTextareaFocus}
                            value={article.ingress} />
                    </div>

                </div>

                <div class='col-6 d-flex flex-column'>
                    <div class='form-group'>
                        <label class='text-white-50'>Widget</label>
                        {['helloworld', 'clock', 'booking'].map(e => (
                            <div class='form-check'>
                                <input class='form-check-input' type='radio' name='widget' id={`widget${e}`} value={e} onInput={handleInput} checked={article.widget === e} />
                                <label class='form-check-label text-white-50' for={`widget${e}`}>
                                    {e}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
                <div class='col-6 d-flex flex-column'>
                    <div class='form-group'>
                        <label class='text-white-50'>Widget List</label>
                        {['helloworld', 'clock', 'booking'].map(e => (
                            <div class='form-check'>
                                <input class='form-check-input' type='radio' name='widgetList' id={`widgetList${e}`} value={e} onInput={handleInput} checked={article.widgetList === e} />
                                <label class='form-check-label text-white-50' for={`widgetList${e}`}>
                                    {e}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>


                <div class='col-12 d-flex flex-column'>
                    <div class='form-group flex-grow-1'>
                        <label for='bodyInput' class='text-white-50'>Brødtekst</label>
                        <textarea name='body' class={`${styles.textareaAutoHeight} form-control`} id='bodyInput' rows='10'
                            onInput={handleTextareaInput}
                            onFocus={this.handleTextareaFocus}
                            value={article.body} />
                        <small class='float-right'>
                            <small class='text-white'>
                                Ord: {util.wordCount(article.body)}, 
                                Lesetid: {util.readTime(article.body, 'no')}
                            </small>
                        </small>
                    </div>
                    <div class='form-group'>
                        <label for='notesInput' class='text-white-50'>Notater (vises kun her i admin)</label>
                        <textarea name='notes' class={`form-control`} id='notesInput' rows='5'
                            onInput={handleTextareaInput}
                            onFocus={this.handleTextareaFocus}
                            value={article.notes} />
                    </div>
                </div>
            </div>
        );

        const shareLink = `${this.imageServer}/${utilHtml.asLinkPart(article.category)}/${utilHtml.asLinkPart(article.title)}/${article.id}`;
        const renderedPreview = (
            <div class='col-12'>
                {renderImages}
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
                    {[0, 1, 2, 3].map((val, idx) =>
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
                    {[0, 1, 2, 3].map((val, idx) =>
                        <li class={`list-group-item list-group-item-action flex-column align-items-start ${idx % 2 > 0 ? 'list-group-item-secondary' : ''}`}>
                            <div class='form-group row'>
                                <div class='col-5'>
                                    <label for='linkTitle'>Tittel på siden du linker til</label>
                                    <input class='form-control' id='linkTitle'
                                        onInput={linkstate(that, `article.links.${val}.title`)}
                                        value={util.getString(article, 'links', val, 'title')}
                                        placeholder='Ie: Litt.no / Sorensos Blog'
                                    />
                                </div>
                                <div class='col-7'>
                                    <label for='linkText'>Linktekst</label>
                                    <input class='form-control' id='linkText'
                                        onInput={linkstate(that, `article.links.${val}.text`)}
                                        value={util.getString(article, 'links', val, 'text')}
                                    />
                                </div>
                                <div class='col-8'>
                                    <label for='link'>Link</label>
                                    <input class='form-control' id='link'
                                        onInput={linkstate(that, `article.links.${val}.url`)}
                                        value={util.getString(article, 'links', val, 'url')}
                                        placeholder='Link til side...'
                                    />
                                </div>
                                <div class='col-4'>
                                    <label>&nbsp;</label>
                                    <button class='form-control btn btn-dark m-1'
                                        onClick={this.handleClickCode}
                                        data-content={`[${util.getString(article, 'links', val, 'title')}](${util.getString(article, 'links', val, 'url')} '${util.getString(article, 'links', val, 'text')}')\n`}>
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
                    {article && article.img && article.img.map((img, idx) => (
                        <li class={`list-group-item list-group-item-action flex-column align-items-start ${idx % 2 > 0 ? 'list-group-item-secondary' : ''}`}>
                            <div class='d-flex w-100 justify-content-between'>
                                <span class='mb-1'><small>{img.src}</small></span>
                                <small>{util.formatBytes(util.getString(img, 'stats', 'size'), 2)}</small>
                                <button class='btn btn-danger btn-sm' data-image={idx} onClick={handleRemoveImageClick}>X</button>
                            </div>
                            <div class='d-flex w-100 justify-content-between'>
                                <p>{img.src && <img src={`https://${imageServer}/150x/${imagePath}/${img.src}`} style='max-height: 150px;'  class='img-fluid' onError={this.handleImageErrored} />}</p>
                                <small>
                                    <button class='btn btn-sm m-1' onClick={this.handleClickCode} data-content={`![${img.title || 'Tittel'}](/pho/${img.src}?w=750 '${img.text || ''}')\n`}>
                                        <i class='fas fa-image'></i> Image
                                    </button>
                                    <button class='btn btn-sm m-1' onClick={this.handleClickCode} data-content={`[![${img.title || 'Tittel'}](/pho/${img.src}?w=750#card '${img.text || ''}')](${img.url})\n`}>
                                        <i class='fas fa-link'></i> Link
                                    </button>
                                    <button class='btn btn-sm m-1' onClick={this.handleClickCode} data-content={`![${img.title || 'Tittel'}](/pho/${img.src}?w=750#card '${img.text || ''}')\n`}>
                                        <i class='fas fa-file-image'></i> Card
                                    </button>
                                    <button class='btn btn-sm m-1' onClick={this.handleClickCode} data-content={`![${img.title || 'Tittel'}](/pho/${img.src}?w=750#card2 '${img.text || ''}')\n`}>
                                        <i class='far fa-image'></i> Card 2
                                    </button>
                                    <button class='btn btn-sm m-1' onClick={this.handleClickCode} data-content={`<h5>Detaljer om bildet</h5>
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
                                    </button>
                                    <button class='btn btn-sm m-1' onClick={this.handleClickCode} data-content={`@[:img.${idx}.exif.lat],[:img.${idx}.exif.lng]\n`}>
                                        <i class='fas fa-location-arrow'></i> GPS
                                    </button>
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
                    ))}
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
                        return (
                            <div class='col-2 p-1'>
                                {img.src && <img src={`https://${imageServer}/150x/${imagePath}/${img.src}`} class='img-fluid' data-idx={idx} onclick={handleImglistClick} onError={this.handleImageErrored}/>}
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
                        {renderedEditArticle}
                    </div>
                    <div class='col-12 col-md-6 mt-2 mt-md-0 overflow-auto vh-100' id='previewColumn'>
                        <div class='row'>
                            {renderedMenu}
                            {currentMenu === 'preview' && renderedPreview}
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
