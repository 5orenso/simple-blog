import { h, Component } from 'preact';

import MessagesLite from '../messagesLite';

import util from '../../util';

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

export default class Edit extends Component {
    constructor(props) {
        super(props);
        this.state = Object.assign({}, initialState);
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

    render() {
        const {
            currentMenu, currentTagIdx, currentTag, toggleDropdown,
            backgroundHex, backgroundHexR, backgroundHexG, backgroundHexB,
            forgroundHex, forgroundHexR, forgroundHexG, forgroundHexB,
            fontsizeH1, fontweightH1, fontsizeH3, fontweightH3, fontsizeH5, fontweightH5,
        } = this.state;
        const {
            article = {},
            catlist = [],
            handleClickBack,
            handleClickSave,
            handleClickNew,
            handleInput,
            handleInputRaw,
            handleAddImage,
            handleRemoveImageClick,
            handleTextareaInput,
            toggleLanguageMenu,

            previewJwtToken,
            sessionEmail = '',
            imageServer,
            imagePath,
            styles = {},
            messages,
            language,
        } = this.props;

        const authorDefault = sessionEmail.replace(/\@.+$/, '');

        return (<div>
            <div class='row bg-secondary'>
                <div class='col-12 sticky-top d-flex justify-content-between'>
                    <div class='col-3'>
                        <button type='button' class='btn btn-warning mr-2' onclick={handleClickBack}>
                            <span class='d-sm-none'><i class='fas fa-arrow-left' /></span>
                            <span class='d-none d-sm-block'><i class='fas fa-arrow-left' /> Tilbake</span>
                        </button>
                    </div>
                    <div class='col-6 text-center'>
                        <button type='submit' class='btn btn-success mr-2' onClick={handleClickSave}>
                            <span class='d-sm-none'><i class='fas fa-save' /></span>
                            <span class='d-none d-sm-block'><i class='fas fa-save' /> Lagre</span>
                        </button>
                        <a class='btn btn-primary' target='_blank' href={`${this.serverName}/v2/${util.htmlIdSafe(article.category || 'no-category')}/${util.htmlIdSafe(article.title || 'no-title')}/${article.id}?previewJwtToken=${previewJwtToken}`}>
                            <span class='d-sm-none'><i class='fas fa-external-link-alt' /></span>
                            <span class='d-none d-sm-block'><i class='fas fa-external-link-alt' /> Preview</span>
                        </a>
                    </div>
                    <div class='col-3'>
                        <button class='btn btn-info float-right ml-2' onClick={e => handleClickNew(e, {
                            author: authorDefault,
                            category: catlist[0].url,
                            categoryId: catlist[0].id,
                        })}>
                            <span class='d-sm-none'><i class='fas fa-plus' /></span>
                            <span class='d-none d-sm-block'><i class='fas fa-plus' /> Ny artikkel</span>
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
                                        {[2, 3, 4, 8, 22, 23].indexOf(cat.type) !== -1 && <i class='fas fa-ad mr-2' />}
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
                            Sortering <i class='fas fa-sort-numeric-up-alt' />
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

                <div class='col-12'>
                    <ul class="nav nav-pills nav-fill">
                        <li class="nav-item">
                            <button class={`nav-link btn btn-block ${language === 'no' && 'active'}`} onClick={toggleLanguageMenu} data-lang='no'>Norsk 🇳🇴</button>
                        </li>
                        <li class="nav-item">
                            <button class={`nav-link btn btn-block ${language === 'en' && 'active'}`} onClick={toggleLanguageMenu} data-lang='en'>English 🇬🇧</button>
                        </li>
                    </ul>
                </div>

                {language === 'en' && <div class='col-12 d-flex flex-column'>
                    <div class='form-group'>
                        <label for='titleEnInput' class='text-white-50'>Title 🇬🇧</label>
                        <input type='text' class='form-control' id='titleEnInput'
                            name='titleEn'
                            onInput={handleInput}
                            value={article.titleEn}
                        />
                        <details>
                            <summary>
                                Norwegian 🇳🇴
                            </summary>
                            <h5>{article.title}</h5>
                        </details>
                    </div>
                    <div class='form-group'>
                        <label for='teaserEnInput' class='text-white-50'>Teaser 🇬🇧</label>
                        <input type='text' class='form-control' id='teaserEnInput'
                            name='teaserEn'
                            onInput={handleInput}
                            value={article.teaserEn}
                        />
                        <details>
                            <summary>
                                Norwegian 🇳🇴
                            </summary>
                            <strong>{article.teaser}</strong>
                        </details>
                    </div>
                    <div class='form-group'>
                        <label for='ingressEnInput' class='text-white-50'>Ingress 🇬🇧</label>
                        <textarea name='ingressEn' class={`form-control`} id='ingressEnInput' rows='3'
                            onInput={handleTextareaInput}
                            onFocus={this.handleTextareaFocus}
                            value={article.ingressEn}
                        />
                        <details>
                            <summary>
                                Norwegian 🇳🇴
                            </summary>
                            <div class='lead' id='ingressDisplayEnglishEdit' dangerouslySetInnerHTML={{
                                __html: utilHtml.replaceMarked(
                                    utilHtml.replaceDataTags(article.ingress, article)
                                ),
                            }}></div>
                        </details>
                    </div>
                    <div class='form-group flex-grow-1'>
                        <label for='bodyEnInput' class='text-white-50'>Body 🇬🇧</label>
                        <textarea name='bodyEn' class={`${styles.textareaAutoHeight} form-control`} id='bodyEnInput' rows='10'
                            onInput={handleTextareaInput}
                            onFocus={this.handleTextareaFocus}
                            value={article.bodyEn}
                        />
                        <small class='float-right'>
                            <small class='text-white'>
                                Words: {util.wordCount(article.bodyEn)},
                                Read time: {util.readTime(article.bodyEn, 'en')}
                            </small>
                        </small>
                        <details>
                            <summary>
                                Norwegian 🇳🇴
                            </summary>
                            <div id='bodyDisplayEnglishEdit' dangerouslySetInnerHTML={{
                                __html: utilHtml.replaceMarked(
                                    utilHtml.replaceDataTags(article.body, article)
                                ),
                            }}></div>
                        </details>
                    </div>
                    <div class='form-group flex-grow-1'>
                        <button type='button' class='btn btn-sm float-right btn-warning' onClick={this.translateToEnglish} data-fromfield='body' data-tofield='bodyEn'>Translate to english with Google</button>
                    </div>
                </div>}

                {language === 'no' && <div class='col-12 d-flex flex-column'>
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

                </div>}

                {language === 'no' && <div class='col-12 d-flex flex-column mb-2 text-white-50'>
                    <details>
                        <summary>
                            Widgets
                        </summary>
                        <div class='row text-dark'>
                            <div class='col-6 d-flex flex-column'>
                                <div class='form-group'>
                                    <label class='text-white-50'>Widget in article</label>
                                    <div class='form-check'>
                                        <input class='form-check-input' type='radio' name='widget' id={`widgetNone`} value='null' onInput={handleInput} checked={!article.widget || article.widget === 'null'} />
                                        <label class='form-check-label text-white-50' for={`widgetNone`}>
                                            None
                                        </label>
                                    </div>
                                    {widgetList.map(e => (
                                        <div class='form-check'>
                                            <input class='form-check-input' type='radio' name='widget' id={`widget${e}`} value={e} onInput={handleInput} checked={article.widget === e} />
                                            <label class='form-check-label text-white-50' for={`widget${e}`}>
                                                {e}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                <div class='form-group'>
                                    {widgetList.map((wi) => {
                                        if (article.widget === wi && Array.isArray(widgetFields[wi])) {
                                            return (
                                                <div>
                                                    <label class='text-white-50'>Widget {wi} data</label>
                                                    <div class='form-group'>
                                                        {widgetFields[wi].map(field => <div>
                                                            <label for={`${wi}-${field}Input`} class='text-white-50'>{wi}-{field}</label>
                                                            <input type='text' class='form-control' id={`${wi}-${field}Input`}
                                                                name={`${wi}-${field}`}
                                                                onInput={handleInput}
                                                                value={article[`${wi}-${field}`]}
                                                            />
                                                        </div>)}
                                                    </div>
                                                </div>
                                            );
                                        }
                                    })}
                                </div>
                            </div>
                            <div class='col-6 d-flex flex-column'>
                                <div class='form-group'>
                                    <label class='text-white-50'>Widget in lists</label>
                                    <div class='form-check'>
                                        <input class='form-check-input' type='radio' name='widgetList' id={`widgetListNone`} value='null' onInput={handleInput} checked={!article.widgetList || article.widgetList === 'null'} />
                                        <label class='form-check-label text-white-50' for={`widgetListNone`}>
                                            None
                                        </label>
                                    </div>                                    
                                    {widgetList.map(e => (
                                        <div class='form-check'>
                                            <input class='form-check-input' type='radio' name='widgetList' id={`widgetList${e}`} value={e} onInput={handleInput} checked={article.widgetList === e} />
                                            <label class='form-check-label text-white-50' for={`widgetList${e}`}>
                                                {e}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                <div class='form-group'>
                                    {widgetList.map((wi) => {
                                        if (article.widgetList === wi && Array.isArray(widgetFields[wi])) {
                                            return (
                                                <div>
                                                    <label class='text-white-50'>WidgetList {wi} data</label>
                                                    <div class='form-group'>
                                                        {widgetFields[wi].map(field => <div>
                                                            <label for={`${wi}-${field}Input`} class='text-white-50'>{wi}-{field}</label>
                                                            <input type='text' class='form-control' id={`${wi}-${field}Input`}
                                                                name={`${wi}-${field}`}
                                                                onInput={handleInput}
                                                                value={article[`${wi}-${field}`]}
                                                            />
                                                        </div>)}
                                                    </div>
                                                </div>
                                            );
                                        }
                                    })}
                                </div>

                            </div>
                        </div>
                    </details>

                    <details>
                        <summary>
                            Font size, color and weight
                        </summary>
                        <div class='row text-dark'>
                            <div class='col-6 d-flex flex-column'>
                                <div class='form-group'>
                                    <label class='text-white-50'>Background color</label>

                                    <div class='form-group my-0'>
                                        <button
                                            class='btn btn-sm btn-outline-primary mr-1 mb-1'
                                            type='button'
                                            onClick={this.setColorToValue}
                                            data-finalname='background'
                                            data-hexfixed='#0275d8'
                                            data-rfixed='2'
                                            data-gfixed='117'
                                            data-bfixed='216'
                                        >primary</button>
                                        <button
                                            class='btn btn-sm btn-outline-success mr-1 mb-1'
                                            type='button'
                                            onClick={this.setColorToValue}
                                            data-finalname='background'
                                            data-hexfixed='#5cb85c'
                                            data-rfixed='92'
                                            data-gfixed='184'
                                            data-bfixed='92'
                                        >success</button>
                                        <button
                                            class='btn btn-sm btn-outline-info mr-1 mb-1'
                                            type='button'
                                            onClick={this.setColorToValue}
                                            data-finalname='background'
                                            data-hexfixed='#5bc0de'
                                            data-rfixed='91'
                                            data-gfixed='192'
                                            data-bfixed='222'
                                        >info</button>
                                        <button
                                            class='btn btn-sm btn-outline-warning mr-1 mb-1'
                                            type='button'
                                            onClick={this.setColorToValue}
                                            data-finalname='background'
                                            data-hexfixed='#f0ad4e'
                                            data-rfixed='240'
                                            data-gfixed='173'
                                            data-bfixed='78'
                                        >warning</button>
                                        <button
                                            class='btn btn-sm btn-outline-danger mr-1 mb-1'
                                            type='button'
                                            onClick={this.setColorToValue}
                                            data-finalname='background'
                                            data-hexfixed='#d9534f'
                                            data-rfixed='217'
                                            data-gfixed='83'
                                            data-bfixed='79'
                                        >danger</button>
                                        <button
                                            class='btn btn-sm btn-outline-dark mr-1 mb-1'
                                            type='button'
                                            onClick={this.setColorToValue}
                                            data-finalname='background'
                                            data-hexfixed='#292b2c'
                                            data-rfixed='41'
                                            data-gfixed='43'
                                            data-bfixed='44'
                                        >dark</button>
                                        <button
                                            class='btn btn-sm btn-outline-light mr-1 mb-1'
                                            type='button'
                                            onClick={this.setColorToValue}
                                            data-finalname='background'
                                            data-hexfixed='#f7f7f7'
                                            data-rfixed='247'
                                            data-gfixed='247'
                                            data-bfixed='247'
                                        >light</button>
                                        <button
                                            class='btn btn-sm btn-outline-success mr-1 mb-1'
                                            type='button'
                                            onClick={this.setColorToValue}
                                            data-finalname='background'
                                            data-hexfixed=''
                                            data-rfixed=''
                                            data-gfixed=''
                                            data-bfixed=''
                                        >Original</button>
                                    </div>

                                    <details>
                                        <summary>
                                            Custom colors
                                        </summary>
                                        <div class='form-group d-flex align-items-center my-0'>
                                            <input
                                                class={`form-control mr-2`}
                                                data-finalname='background'
                                                type='color'
                                                value={backgroundHex || '#ffffff'}
                                                onInput={this.setColorToHex}
                                            />
                                        </div>
                                    </details>

                                    <div class='text-center rounded-lg' style={`background-color: ${backgroundHex};`}>
                                        <h3 style={`color: ${forgroundHex};`}>{article.background || backgroundHex}</h3>
                                    </div>
                                </div>
                            </div>
                            <div class='col-6 d-flex flex-column'>
                                <div class='form-group'>
                                    <label class='text-white-50'>Forground color</label>

                                    <div class='form-group my-0'>
                                        <button
                                            class='btn btn-sm btn-outline-primary mr-1 mb-1'
                                            type='button'
                                            onClick={this.setColorToValue}
                                            data-finalname='forground'
                                            data-hexfixed='#0275d8'
                                            data-rfixed='2'
                                            data-gfixed='117'
                                            data-bfixed='216'
                                        >primary</button>
                                        <button
                                            class='btn btn-sm btn-outline-success mr-1 mb-1'
                                            type='button'
                                            onClick={this.setColorToValue}
                                            data-finalname='forground'
                                            data-hexfixed='#5cb85c'
                                            data-rfixed='92'
                                            data-gfixed='184'
                                            data-bfixed='92'
                                        >success</button>
                                        <button
                                            class='btn btn-sm btn-outline-info mr-1 mb-1'
                                            type='button'
                                            onClick={this.setColorToValue}
                                            data-finalname='forground'
                                            data-hexfixed='#5bc0de'
                                            data-rfixed='91'
                                            data-gfixed='192'
                                            data-bfixed='222'
                                        >info</button>
                                        <button
                                            class='btn btn-sm btn-outline-warning mr-1 mb-1'
                                            type='button'
                                            onClick={this.setColorToValue}
                                            data-finalname='forground'
                                            data-hexfixed='#f0ad4e'
                                            data-rfixed='240'
                                            data-gfixed='173'
                                            data-bfixed='78'
                                        >warning</button>
                                        <button
                                            class='btn btn-sm btn-outline-danger mr-1 mb-1'
                                            type='button'
                                            onClick={this.setColorToValue}
                                            data-finalname='forground'
                                            data-hexfixed='#d9534f'
                                            data-rfixed='217'
                                            data-gfixed='83'
                                            data-bfixed='79'
                                        >danger</button>
                                        <button
                                            class='btn btn-sm btn-outline-dark mr-1 mb-1'
                                            type='button'
                                            onClick={this.setColorToValue}
                                            data-finalname='forground'
                                            data-hexfixed='#292b2c'
                                            data-rfixed='41'
                                            data-gfixed='43'
                                            data-bfixed='44'
                                        >dark</button>
                                        <button
                                            class='btn btn-sm btn-outline-light mr-1 mb-1'
                                            type='button'
                                            onClick={this.setColorToValue}
                                            data-finalname='forground'
                                            data-hexfixed='#f7f7f7'
                                            data-rfixed='247'
                                            data-gfixed='247'
                                            data-bfixed='247'
                                        >light</button>
                                        <button
                                            class='btn btn-sm btn-outline-success mr-1 mb-1'
                                            type='button'
                                            onClick={this.setColorToValue}
                                            data-finalname='forground'
                                            data-hexfixed=''
                                            data-rfixed=''
                                            data-gfixed=''
                                            data-bfixed=''
                                        >Original</button>
                                    </div>

                                    <details>
                                        <summary>
                                            Custom colors
                                        </summary>
                                        <div class='form-group d-flex align-items-center my-0'>
                                            <input
                                                class={`form-control mr-2`}
                                                data-finalname='forground'
                                                type='color'
                                                value={forgroundHex || '#000000'}
                                                onInput={this.setColorToHex}
                                            />
                                        </div>
                                    </details>

                                    <div class='text-center rounded-lg' style={`background-color: ${backgroundHex};`}>
                                        <h3 style={`color: ${forgroundHex};`}>{article.forground || forgroundHex}</h3>
                                    </div>
                                </div>
                            </div>

                            <details class='col-12'>
                                <summary>
                                    Custom size & weight
                                </summary>
                                <div class='row'>
                                    <div class='col-6 d-flex flex-column'>
                                        <div class='form-group'>
                                            <label class='text-white-50'>Title font-size H1</label>

                                            <div class='form-group d-flex align-items-center my-0'>
                                                <label for='fontsizeH1' class='mr-2 my-0'>Fontsize</label>
                                                <input
                                                    class={`form-control mr-2`}
                                                    name='fontsizeH1'
                                                    type='range'
                                                    min='0.5'
                                                    max='10'
                                                    id='fontsizeH1'
                                                    step='0.1'
                                                    value={article.fontsizeH1 || fontsizeH1}
                                                    onInput={handleInput}
                                                />
                                                <output for='fontsizeH1'>{article.fontsizeH1 || 'default'}</output>
                                            </div>
                                        </div>
                                    </div>
                                    <div class='col-6 d-flex flex-column'>
                                        <div class='form-group'>
                                            <label class='text-white-50'>Title font-weight H1</label>

                                            <div class='form-group d-flex align-items-center my-0'>
                                                <label for='fontweightH1' class='mr-2 my-0'>Fontweight</label>
                                                <input
                                                    class={`form-control mr-2`}
                                                    name='fontweightH1'
                                                    type='range'
                                                    min='50'
                                                    max='1000'
                                                    id='fontweightH1'
                                                    step='10'
                                                    value={article.fontweightH1 || fontweightH1}
                                                    onInput={handleInput}
                                                />
                                                <output for='fontweightH1'>{article.fontweightH1 || 'default'}</output>
                                            </div>
                                        </div>
                                    </div>

                                    <div class='col-6 d-flex flex-column'>
                                        <div class='form-group'>
                                            <label class='text-white-50'>Title font-size H3</label>

                                            <div class='form-group d-flex align-items-center my-0'>
                                                <label for='fontsizeH3' class='mr-2 my-0'>Fontsize</label>
                                                <input
                                                    class={`form-control mr-2`}
                                                    name='fontsizeH3'
                                                    type='range'
                                                    min='0.5'
                                                    max='10'
                                                    id='fontsizeH3'
                                                    step='0.1'
                                                    value={article.fontsizeH3 || fontsizeH3}
                                                    onInput={handleInput}
                                                />
                                                <output for='fontsizeH3'>{article.fontsizeH3 || 'default'}</output>
                                            </div>
                                        </div>
                                    </div>
                                    <div class='col-6 d-flex flex-column'>
                                        <div class='form-group'>
                                            <label class='text-white-50'>Title font-weight H3</label>

                                            <div class='form-group d-flex align-items-center my-0'>
                                                <label for='fontweightH3' class='mr-2 my-0'>Fontweight</label>
                                                <input
                                                    class={`form-control mr-2`}
                                                    name='fontweightH3'
                                                    type='range'
                                                    min='50'
                                                    max='1000'
                                                    id='fontweightH3'
                                                    step='10'
                                                    value={article.fontweightH3 || fontweightH3}
                                                    onInput={handleInput}
                                                />
                                                <output for='fontweightH3'>{article.fontweightH3 || 'default'}</output>
                                            </div>
                                        </div>
                                    </div>

                                    <div class='col-6 d-flex flex-column'>
                                        <div class='form-group'>
                                            <label class='text-white-50'>Title font-size H5</label>

                                            <div class='form-group d-flex align-items-center my-0'>
                                                <label for='fontsizeH5' class='mr-2 my-0'>Fontsize</label>
                                                <input
                                                    class={`form-control mr-2`}
                                                    name='fontsizeH5'
                                                    type='range'
                                                    min='0.5'
                                                    max='10'
                                                    id='fontsizeH5'
                                                    step='0.1'
                                                    value={article.fontsizeH5 || fontsizeH5}
                                                    onInput={handleInput}
                                                />
                                                <output for='fontsizeH5'>{article.fontsizeH5 || 'default'}</output>
                                            </div>
                                        </div>
                                    </div>
                                    <div class='col-6 d-flex flex-column'>
                                        <div class='form-group'>
                                            <label class='text-white-50'>Title font-weight H5</label>

                                            <div class='form-group d-flex align-items-center my-0'>
                                                <label for='fontweightH5' class='mr-2 my-0'>Fontweight</label>
                                                <input
                                                    class={`form-control mr-2`}
                                                    name='fontweightH5'
                                                    type='range'
                                                    min='50'
                                                    max='1000'
                                                    id='fontweightH5'
                                                    step='10'
                                                    value={article.fontweightH5 || fontweightH5}
                                                    onInput={handleInput}
                                                />
                                                <output for='fontweightH5'>{article.fontweightH5 || 'default'}</output>
                                            </div>
                                        </div>
                                    </div>
                                    <div class='col-12 text-center'>
                                        <div class='rounded-lg' style={`background-color: ${backgroundHex};`}>
                                            <h1 style={`color: ${forgroundHex}; font-size: ${article.fontsizeH1}rem; font-weight: ${article.fontweightH1};`}>H1: {article.title}</h1>
                                        </div>
                                    </div>
                                    <div class='col-4 text-center'>
                                        <div class='rounded-lg' style={`background-color: ${backgroundHex};`}>
                                            <h3 style={`color: ${forgroundHex}; font-size: ${article.fontsizeH3}rem; font-weight: ${article.fontweightH3};`}>H3: {article.title}</h3>
                                        </div>
                                    </div>
                                    <div class='col-2 text-center'>
                                        <div class='rounded-lg' style={`background-color: ${backgroundHex};`}>
                                            <h5 style={`color: ${forgroundHex}; font-size: ${article.fontsizeH5}rem; font-weight: ${article.fontweightH5};`}>H5: {article.title}</h5>
                                        </div>
                                    </div>
                                </div>
                            </details>

                        </div>
                    </details>

                </div>}

                {language === 'no' && <div class='col-12 d-flex flex-column'>
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
                </div>}
            </div>
        </div>);
    }
}
