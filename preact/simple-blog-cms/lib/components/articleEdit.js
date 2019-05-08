import { h, Component } from 'preact';

import ImageUpload from './imageUpload';
import MessagesLite from './messagesLite';

import util from '../util';
import utilHtml from '../util-html';

const initialState = {
    currentMenu: 'preview',
    currentTagIdx: -1,
    currentTag: '',
};
const debug = false;
const editMode = 'textarea'; // div
const imageWidth = 150;

export default class ArticleEdit extends Component {
    constructor(props) {
        super(props);
        this.state = Object.assign({}, initialState);
        this.parent = props.that;
        this.imageServer = this.parent.props.apiServer;
    }

    handleMenuClick = (event) => {
        event.preventDefault();
        const el = event.target;

        const currentMenu = el.dataset.menu;
        this.setState({ currentMenu });
        // if (currentMenu === 'preview') {
        // } else if (currentMenu === 'images') {
        // }
    };

    handleClickCode = (event) => {
        event.preventDefault();
        const el = event.target;
        this.parent.typeInTextarea(this.state.currentTextarea, el.dataset.content || el.innerHTML);
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

    render(props) {
        const { currentMenu, currentTagIdx, currentTag } = this.state;
        const styles = props.styles;
        const messages = props.messages;
        const article = props.article;
        const handleInput = props.handleInput;
        const handleAddImage = props.handleAddImage;
        const handleRemoveImageClick = props.handleRemoveImageClick;
        const handleTextareaInput = props.handleTextareaInput;
        const handleClickSave = props.handleClickSave;
        const handleClickNew = props.handleClickNew;

        const handleImageInput = props.handleImageInput;
        const handleImageSubmit = props.handleImageSubmit;
        const handleImglistClick = props.handleImglistClick;
        const handleImageTagClick = props.handleImageTagClick;

        const taglist = props.taglist;

        const imglist = props.imglist;
        const filterQuery = props.filterQuery;

        const images = article.img || [];
        const imagesTotal = images.length;
        const renderImages = images.slice(0, 1).map(img => {
            return (
                <img src={`${this.imageServer}/pho/${img.src}?w=750`} alt='' title='' class='img-fluid' />
            );
        });

        const renderedMenu = (
            <nav class='nav nav-pills nav-fill mb-3 sticky-top bg-light'>
                <a class={`nav-item nav-link ${currentMenu === 'preview' ? 'active' : ''}`} href='#'
                    onClick={this.handleMenuClick} data-menu='preview'>Forhåndsvisning</a>
                <a class={`nav-item nav-link ${currentMenu === 'images' ? 'active' : ''}`} href='#'
                    onClick={this.handleMenuClick} data-menu='images'>Bilder ({imagesTotal})</a>
                <a class={`nav-item nav-link ${currentMenu === 'meta' ? 'active' : ''}`} href='#'
                    onClick={this.handleMenuClick} data-menu='meta'>Meta</a>
            </nav>
        );

        const renderedEditArticle = (
            <div class='row bg-secondary'>
                <div class='col-12 sticky-top'>
                    <button class='btn btn-info float-right ml-2' onClick={handleClickNew}>+ Ny artikkel</button>

                    <button type='submit' class='btn btn-success' onClick={handleClickSave}>Lagre</button>
                    <MessagesLite styles={styles} messages={messages} />
                </div>

                <div class='col-2'>
                    <div class='form-group'>
                        <label for='statusInput' class='text-white-50'>Status</label>
                        <input type='number' class='form-control' id='statusInput' placeholder='Status'
                            min='1' max='3' step='1'
                            name='status'
                            onInput={handleInput}
                            value={article.status} />
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
                <div class='col-6'>
                    <div class='form-group'>
                        <label for='categoryInput' class='text-white-50'>Kategori</label>
                        <input type='text' class='form-control' id='categoryInput' placeholder='Kategori'
                            name='category'
                            onInput={handleInput}
                            value={article.category} />
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
                    <div class='form-group flex-grow-1'>
                        <label for='bodyInput' class='text-white-50'>Brødtekst</label>
                        <textarea name='body' class={`${styles.textareaAutoHeight} form-control`} id='bodyInput' rows='10'
                            onInput={handleTextareaInput}
                            onFocus={this.handleTextareaFocus}
                            value={article.body} />
                    </div>

                </div>
            </div>
        );

        const renderedPreview = (
            <div class='col-12'>
                {renderImages}
                <h1>{article.title}</h1>
                <h5>{article.teaser}</h5>
                <div>
                    {util.isoDateNormalized(article.published)} by {article.author} |
                    &nbsp;{article.category} |
                    &nbsp;<span class={`badge badge-${util.getStatusClass(article.status)} p-2`}>{util.getStatus(article.status)}</span>
                </div>
                <div class='mb-3'>
                    {Array.isArray(article.tags) && article.tags.map(tag =>
                        <span class='badge badge-info mr-1'>{tag}</span>
                    )}
                </div>
                <div class='font-weight-bolder' id='ingressDisplay' dangerouslySetInnerHTML={{
                    __html: utilHtml.replaceMarked(
                        utilHtml.replaceDataTags(article.ingress, article)
                    ),
                }}></div>
                <div id='bodyDisplay' dangerouslySetInnerHTML={{
                    __html: utilHtml.replaceMarked(
                        utilHtml.replaceDataTags(article.body, article)
                    ),
                }}></div>
            </div>
        );

        const renderedImages = (
            <div class='col-12'>
                <div class='form-group'>
                    <ImageUpload that={this.parent} styles={styles}
                        category={article.category}
                        title={article.title}
                        handleAddImage={handleAddImage}
                    />
                </div>

                <h3>Bilder i artikkelen:</h3>
                <ul class='list-group'>
                    {article && article.img && article.img.map((img, idx) => (
                        <li class='list-group-item list-group-item-action flex-column align-items-start'>
                            <div class='d-flex w-100 justify-content-between'>
                                <span class='mb-1'><small>{img.src}</small></span>
                                <small>{util.formatBytes(util.getString(img, 'stats', 'size'), 2)}</small>
                                <button class='btn btn-danger btn-sm' data-image={idx} onClick={handleRemoveImageClick}>X</button>
                            </div>
                            <div class='d-flex w-100 justify-content-between'>
                                <p><img src={`${this.imageServer}/pho/${img.src}?w=150`} height='50'  class='img-fluid' /></p>
                                <small>
                                    <button class='btn btn-sm m-1' onClick={this.handleClickCode} data-content={`![${img.text || 'Image title'}](/pho/${img.src}?w=750 "Image description")\n`}>
                                        <i class="fas fa-image"></i> Image
                                    </button>
                                    <button class='btn btn-sm m-1' onClick={this.handleClickCode} data-content={`![${img.text || 'Image title'}](/pho/${img.src}?w=750#card "Image description")\n`}>
                                        <i class="fas fa-file-image"></i> Card
                                    </button>
                                    <button class='btn btn-sm m-1' onClick={this.handleClickCode} data-content={`![${img.text || 'Image title'}](/pho/${img.src}?w=750#card2 "Image description")\n`}>
                                        <i class="far fa-image"></i> Card 2
                                    </button>
                                    <button class='btn btn-sm m-1' onClick={this.handleClickCode} data-content={`<h5>Detaljer om bildet</h5>
<ul>
<li><i class="fas fa-camera"></i> [:img.${idx}.exif.model]</li>
<li>Objektiv: [:img.${idx}.exif.lensModel]</li>
<li>Blender: f/[:img.${idx}.exif.fNumber]</li>
<li>Brennvidde: [:img.${idx}.exif.focalLength] mm</li>
<li>Eksponering: [:img.${idx}.exif.exposureTime] sec</li>
<li>ISO: [:img.${idx}.exif.photographicSensitivity]</li>
<li>Oppløsning: [:img.${idx}.features.width] x [:img.${idx}.features.height]px ([:img.${idx}.stats.size size])</li>
<li><i class="fas fa-clock"></i> [:img.${idx}.exif.dateTimeOriginal date]</li>
<li><i class="fas fa-mountain"></i> [:img.${idx}.exif.gpsAltitude] moh</li>
<li><i class="fas fa-location-arrow"></i> [:img.${idx}.exif.lat position], [:img.${idx}.exif.lng position]</li>
<li><i class="fas fa-print"></i> [:img.${idx}.features.print+size dim] cm</li>
</ul>
`}><i class="fas fa-info-circle"></i> Bildeinfo
                                    </button>
                                    <button class='btn btn-sm m-1' onClick={this.handleClickCode} data-content={`@[:img.${idx}.exif.lat],[:img.${idx}.exif.lng]\n`}>
                                        <i class="fas fa-location-arrow"></i> GPS
                                    </button>
                                    <button class='btn btn-sm m-1' onClick={this.handleClickCode} data-content={`**Dette bildet er tilsalgs. Send meg en _[e-post](mailto:sorenso@gmail.com?subject=Henvendelse%20ang%20bilde:%20[:img.${idx}.src])_ eller ta kontakt på _[Facebook](http://facebook.com/sorenso)_ om du er interessert.**\n`}>
                                        <i class="fas fa-shopping-cart"></i> Kjøp
                                    </button>
                                </small>
                            </div>
                        </li>
                    ))}
                </ul>

                <h3>Bildearkivet:</h3>
                <div class='col-12'>
                    <div class='d-flex justify-content-center'>
                        <div class="col-10 mb-2">
                            <input type="text" class="form-control" placeholder="Søk etter bilder" name="q"
                                onKeypress={e => handleImageInput(e, 54)}
                            />
                        </div>
                        <div class="col-2">
                            <button class="btn btn-success" onclick={e => handleImageSubmit(e, 54)}>Søk</button>
                        </div>

                    </div>
                </div>
                <div class='row'>
                    <div class='col-12'>
                        {Object.keys(filterQuery).map(key =>
                            <span class={`mr-1 badge badge-danger`}
                                data-name={key}
                                data-value={filterQuery[key]}
                                onClick={handleImageTagClick}
                            >
                                {key}: {filterQuery[key]}
                            </span>
                        )}
                    </div>
                    {imglist.map((img, idx) => {
                        return (
                            <div class='col-2 p-1'>
                                <img src={`${this.imageServer}/pho/${img.src}?w=${imageWidth}`} class='img-fluid' data-idx={idx} onclick={handleImglistClick} />
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
                                value={util.isoDateNormalized(article.published)} />
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
                                    {Array.isArray(article.relevantWords) ? <h5>Language processing</h5> : ''}
                                    {Array.isArray(article.relevantWords) && article.relevantWords.map(word =>
                                        <span class='badge badge-danger mr-1'
                                            onClick={e => this.handleTagAdd(e, handleInput, word)}
                                        >{word} <i class='fas fa-plus'></i></span>
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
                                                    <img src={`${this.imageServer}/pho/${img.src}?w=500`} class='img-fluid' />
                                                </div>
                                                <div class='col-8'>
                                                    {geoInfo.map(info =>
                                                        <span class='badge badge-primary mr-1'
                                                            onClick={e => this.handleTagAdd(e, handleInput, info)}
                                                        >
                                                            {info} <i class='fas fa-plus'></i>
                                                        </span>
                                                    )}
                                                    {geoInfoExtra.map(info =>
                                                        <span class='badge badge-danger mr-1'
                                                            onClick={e => this.handleTagAdd(e, handleInput, info)}
                                                        >
                                                            {info} <i class='fas fa-plus'></i>
                                                        </span>
                                                    )}
                                                    <br />

                                                    {Array.isArray(img.predictions) && img.predictions.map(pre =>
                                                        <span class='badge badge-secondary mr-1'
                                                            onClick={e => this.handleTagAdd(e, handleInput, pre.className)}
                                                        >{pre.className} <i class='fas fa-plus'></i></span>
                                                    )}
                                                    {Array.isArray(img.predictionsCocoSsd) && img.predictionsCocoSsd.map(pre =>
                                                        <span class='badge badge-dark mr-1'
                                                            onClick={e => this.handleTagAdd(e, handleInput, pre.class)}
                                                        >{pre.class} <i class='fas fa-plus'></i></span>
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
                    <div class='col-12 col-md-6 mb-5 mb-md-0 overflow-auto vh-100' id='editColumn'>
                        {renderedEditArticle}
                    </div>
                    <div class='col-12 col-md-6 mt-5 mt-md-0 overflow-auto vh-100' id='previewColumn'>
                        <div class='row'>
                            {renderedMenu}
                            {currentMenu === 'preview' && renderedPreview}
                            {currentMenu === 'images' && renderedImages}
                            {currentMenu === 'meta' && renderedMeta}
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}
