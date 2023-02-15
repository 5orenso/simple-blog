import { h, Component } from 'preact';
import util from 'preact-util';
import { observer } from 'mobx-preact';
import { Text, Localizer } from 'preact-i18n';
import Markdown from 'preact-markdown';
import linkState from 'linkstate';

import ImageUpload from '../form/imageUpload';

const MARKDOWN_OPTIONS = {
	pedantic: false,
	gfm: true,
	breaks: true,
	sanitize: false,
	smartLists: true,
	smartypants: true,
	xhtml: true,
    highlight: function(code, lang) {
        const hljs = require('highlight.js');
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
      },
    langPrefix: 'hljs language-', // highlight.js css expects a top-level 'hljs' class.
};


{/* <iframe style="border-radius:12px" src="https://open.spotify.com/embed/episode/2LuvaJ0ZviirARinkTYgQG?utm_source=generator" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe> */}
function spotifyPodcast(url) {
    if (!url) {
        return '';
    }
    let regex;
    if (url.match(/spotify\.com/)) {
        // https://open.spotify.com/episode/2LuvaJ0ZviirARinkTYgQG
        // eslint-disable-next-line
        regex = /(<p>|<br>|[\s\t\n]|^)*https*:\/\/(open\.)*spotify\.com\/episode\/(([^?&\s<$]+)((\?|&)[^\s<$]+)*)/gi;
    } else {
        return null;
    }
    // const regexp = /(^|[\s\t\n]+)https*:\/\/(www\.)*youtube\.com\/(.*?v=([^&\s]+)(&[^\s]+)*)/gi;
    const spotifyPodcast = url.replace(regex, (match, p0, p1, p2, p3, p4) => {
        return p3;
    });
    // return spotifyPodcast;
    return (<>
        <div class='embed-responsive' style='height: 152px;'>
            <iframe class='embed-responsive-item' style='border-radius:12px' src={`https://open.spotify.com/embed/episode/${spotifyPodcast}?utm_source=generator`} width='100%' height='152' frameBorder='0' allowfullscreen='' allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture' loading='lazy'></iframe>
        </div>
    </>);
}

function youtubeVideo(url) {
    if (!url) {
        return '';
    }
    let youtubeRegex;
    let isShort = false;

    // https://youtube.com/shorts/HcE_tI9KZWs?feature=share

    if (url.match(/youtube\.com\/shorts/)) {
        // eslint-disable-next-line
        youtubeRegex = /(<p>|<br>|[\s\t\n]|^)*https*:\/\/(www\.)*youtube\.com\/shorts\/(([^?&\s<$]+)((\?|&)[^\s<$]+)*)/gi;
        isShort = true;
    } else if (url.match(/youtube/)) {
        // eslint-disable-next-line
        youtubeRegex = /(<p>|<br>|[\s\t\n]|^)*https*:\/\/(www\.)*youtube\.com\/(.*?v=([^&\s<$]+)(&[^\s<$]+)*)/gi;
    } else if (url.match(/youtu\.be/)) {
        // eslint-disable-next-line
        youtubeRegex = /(<p>|<br>|[\s\t\n]|^)*https*:\/\/(www\.)*youtu\.be\/(([^?&\s<$]+)((\?|&)[^\s<$]+)*)/gi;
    } else {
        return null;
    }
    // const regexp = /(^|[\s\t\n]+)https*:\/\/(www\.)*youtube\.com\/(.*?v=([^&\s]+)(&[^\s]+)*)/gi;
    const youtubeVideo = url.replace(youtubeRegex, (match, p0, p1, p2, p3, p4) => {
        return p3;
    });
    // return youtubeVideo;
    if (isShort) {
        return (<>
            <div class={`w-50 float-right pl-3 embed-responsive embed-responsive-1by1`} >
                <iframe class='embed-responsive-item' src={`https://www.youtube.com/embed/${youtubeVideo}?rel=0`} allowfullscreen></iframe>
            </div>
        </>);
    }
    return (<>
        <div class={`embed-responsive embed-responsive-16by9`} >
            <iframe class='embed-responsive-item' src={`https://www.youtube.com/embed/${youtubeVideo}?rel=0`} allowfullscreen></iframe>
        </div>
    </>);
}

function scrollTo(element, top = 0, left = 0) {
    // element.scrollTop = to;
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'start',
    });
}

const RELOAD_INTERVAL_IN_SEC = 60;
const MAX_ARTICLE_TO_SHOW = 10;
const TOTAL_ARTICLES = 100;

@observer
class Live extends Component {
  	constructor(props) {
        super(props);
        this.state = {
            height: 150,
            maxHeight: 150,
            isOverflow: {},
            isExpanded: {},
            actualHeight: {},
            heights: {},
            newArticle: {},
            showImage: {},
            taglist: [],
            currentTagIdx: -1,
            currentTag: '',
        };
        this.blockRefs = {};
        this.currentTextarea = null;
        this.updateTimer;
        this.imageContainer = null;
        this.imageScrollerRef = null;
    }

    onClickScrollLeft = (e) => {
        const el = this.imageScrollerRef;
        const width = 0 - el.clientWidth;
        el.scrollBy({
            top: 0,
            left: width,
            behavior: 'smooth'
        });
    }

    onClickScrollRight = (e) => {
        const el = this.imageScrollerRef;
        const width = el.clientWidth;
        el.scrollBy({
            top: 0,
            left: width,
            behavior: 'smooth'
        });
    }

    loadAll = async (props = this.props) => {
        const { categoryLive, categoryLiveId, page, artid, tag } = props;
        const { articleStore, appState } = this.props.stores;
        const { isAdmin, isExpert } = appState;
        await articleStore.loadArtlist({
            isAdmin,
            isExpert,
            loadAll: isAdmin ? 1 : undefined,
            limit: TOTAL_ARTICLES,
            category: categoryLive,
            key: 'live',
            tag,
        });
        // this.checkHeights();
        this.animateShit();

        clearTimeout(this.updateTimer);
        this.updateTimer = setTimeout(() => {
            this.loadAll();
        }, RELOAD_INTERVAL_IN_SEC * 1000);

        if (page === 'live' && artid) {
            this.setPageHeaders();
            this.setState({ showMore: true }, () => {
                if (this.blockRefs[artid]) {
                    scrollTo(this.blockRefs[artid]);
                }
            });
        }
    }

    setPageHeaders = () => {
        const { appState, articleStore } = this.props.stores;
        const { imageDomain, imageDomainPath, artid } = this.props;
        const { artlistLive } = articleStore;
        const viewArticle = artlistLive.find((article) => article.id === parseInt(artid, 10));
        const { title, img } = viewArticle;
        const image = img && img.length > 0 ? `${imageDomain}/220x/${imageDomainPath}/${img.src}` : '';
        const description = viewArticle.ingress || viewArticle.body;
        const url = `${location.origin}${location.pathname}#/live/${viewArticle.id}`;
        appState.setPageHeaders({
            title,
            description,
            image,
            url,
        });
    }

    checkHeights = () => {
        // console.log('checkHeights');
        const keys = Object.keys(this.blockRefs);
        keys.forEach((key) => {
            const element = this.blockRefs[key];
            this.checkHeight(key, element);
        });
    }

    checkHeight = (id, element) => {
        const { maxHeight, isOverflow, actualHeight } = this.state;
        const clientHeight = element?.clientHeight || maxHeight;
        const scrollHeight= element?.scrollHeight || maxHeight;
        if (scrollHeight > clientHeight) {
            isOverflow[id] = true;
            actualHeight[id] = scrollHeight;
            this.setState({
                isOverflow,
                actualHeight,
            });
        }
    }

    toggleSize = (e, id) => {
        const { isExpanded, maxHeight, actualHeight, heights } = this.state;
        isExpanded[id] = !isExpanded[id];
        heights[id] = isExpanded[id] ? actualHeight[id] : maxHeight;
        this.setState({
            isExpanded,
            heights,
        });
    }

    toggleShowMore = (e) => {
        const { showMore } = this.state;
        this.setState({
            showMore: !showMore,
        });
    }

    toggleInput = (e) => {
        const { showInput } = this.state;
        this.setState({
            showInput: !showInput,
        });
    }

    toggleShowImage = (e, artId) => {
        e.stopPropagation();
        const { showImage } = this.state;
        showImage[artId] = !showImage[artId];
        this.setState({
            showImage,
        });
    }

    createArticle = async () => {
        const { newArticle } = this.state;
        const { categoryLive, categoryLiveId } = this.props;
        const { appState, articleStore } = this.props.stores;
        const { currentEmail } = appState;

        await articleStore.createArticle({
            author: currentEmail,
            category: categoryLive,
            cateogryId: categoryLiveId,
            status: 2,
            ...newArticle,
        });
        this.loadAll();
        this.setState({
            showInput: false,
            newArticle: {
                title: '',
                url: '',
                body: '',
                img: [],
                tags: [],
            },
        });
    }

    handleAddImage = (file) => {
        const { newArticle } = this.state;
        if (!Array.isArray(newArticle.img)) {
            newArticle.img = [];
        }
        newArticle.img.push(file);
        this.setState({ newArticle });
    }

    handleRemoveImageClick = (e, index) => {
        event.preventDefault();
        const el = event.target;
        const imageIdx = el.dataset.image;
        const { newArticle } = this.state;
        // console.log('article.img', article.img, imageIdx);

        if (Array.isArray(newArticle.img)) {
            // console.log('article.img', article.img, imageIdx);
            newArticle.img.splice(imageIdx, 1);
            this.setState({ newArticle });
        }
    }

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

    typeInTextarea(el, newText) {
        if (el && newText) {
            const start = el.selectionStart;
            const end = el.selectionEnd;
            const name = el.name;

            const { newArticle } = this.state;
            if (typeof newArticle[name] !== 'string') {
                newArticle[name] = '';
            }
            const before = newArticle[name].substring(0, start);
            const after  = newArticle[name].substring(end, newArticle[name].length);
            newArticle[name] = (before + newText + after);

            this.setState({
                newArticle,
            }, () => {
                if (el) {
                    el.focus();
                    el.selectionStart = start + newText.length;
                    el.selectionEnd = start + newText.length;
                }
            });
        }
    }

    handleInsertContent = (e) => {
        e.preventDefault();
        const el = e.target;
        if (el && this.currentTextarea) {
            const { content } = el.closest('button').dataset;
            const newText = content || el.innerHTML;
            // console.log('handleInsertContent', this.currentTextarea, newText)
            this.typeInTextarea(this.currentTextarea, newText);
        }
    }

    handleKeydown = (event, handleInput, taglist) => {
        let currentTagIdx = this.state.currentTagIdx;
        let currentTag;
        const total = taglist.length;
        if (event.key === 'Enter') {
            this.handleInput(event, {
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
    }

    handleTagsInput = (event, handleInput) => {
        // TODO: Add force to lower case function.
        event.target.value = event.target.value.toLowerCase();
        this.handleInput(event, {
            action: 'search',
            name: 'tags',
            type: 'array',
        });
    }

    handleTagAdd = (event, handleInput, tag) => {
        this.handleInput(event, {
            action: 'add',
            name: 'tags',
            value: tag.toLowerCase(),
            type: 'array',
        });
    }

    handleTagRemove = (event, handleInput, tag) => {
        this.handleInput(event, {
            action: 'remove',
            name: 'tags',
            value: tag.toLowerCase(),
            type: 'array',
        });
    }

    handleInput = (event, opt = {}) => {
        event.preventDefault();
        const el = event.target;
        let name = el.name;
        let value = el.value || '';

        if (opt.name && (opt.action === 'add' || value.match(/[,]$/))) {
            let val = opt.value || value;
            val = val.replace(/[, ]+$/, '');
            this.articleInputAdd(opt.name, val, opt.type);
            value = '';
        } else if (opt.name && opt.action === 'remove') {
            return this.articleInputRemove(opt.name, opt.value, opt.type);
        } else if (opt.action === 'search') {
            if (opt.name === 'tags' && value.length >= 1) {
                let loadTaglistTimer = this.state.loadTaglistTimer;
                clearTimeout(loadTaglistTimer);
                loadTaglistTimer = setTimeout(() => this.loadTaglist(1, value), 500);
                this.setState({ loadTaglistTimer });
            }
        } else if (opt.name && opt.value) {
            name = opt.name;
            value = opt.value;
        }

        this.articleInputAdd(name, value);
    }

    loadTaglist = async (currentPage = 1, query) => {
        const limit = this.state.tagsPerPage;
        const offset = (currentPage - 1) * this.state.tagsPerPage;
        const { newArticle } = this.state;
        let titleNin;
        if (typeof newArticle.tags === 'object' && Array.isArray(newArticle.tags)) {
            titleNin = newArticle.tags.join(',');
        }
        const result = await util.fetchApi('/api/tag/', { publish: true, method: 'GET' }, { query, titleNin, limit, offset });
        // console.log('result', result);
        this.setState({
            taglist: result.taglist,
            taglistTotal: result.total,
        });
    }

    articleInputAdd = (name, value, type) => {
        const { newArticle } = this.state;
        const taglist = this.state.taglist;
        if (type === 'array') {
            if (!Array.isArray(newArticle[name])) {
                newArticle[name] = [];
            }
            if (value && newArticle[name].indexOf(value) === -1) {
                newArticle[name].push(value);
                const idx = taglist.findIndex(x => x.title === value);
                taglist.splice(idx, 1);
            }
        } else {
            newArticle[name] = value;
        }
        this.setState({ newArticle, taglist });
    }

    getWidth = () => {
        this.setState({
            // viewerWidth: this.imageContainer?.offsetWidth > 1024 ? 1024 : this.imageContainer?.offsetWidth,
            viewerWidth: this.imageContainer?.offsetWidth,
            windowWidth: window.innerWidth,
        });
        // window.addEventListener('resize', (e) => {
        //     this.getWidth();
        // });
    }

    animateShit = () => {
        // const observer = new IntersectionObserver((entries) => {
        //     entries.forEach((entry) => {
        //         if (entry.isIntersecting) {
        //             entry.target.classList.add('is-visible');
        //         } else {
        //             // entry.target.classList.remove('is-visible');
        //         }
        //     });
        // });
        // const elements = document.querySelectorAll('.animate');
        // elements.forEach((element) => {
        //     observer.observe(element);
        // });
    }

    componentDidMount() {
        this.loadAll();
        this.getWidth();
    }

    componentWillUnmount() {
        clearTimeout(this.updateTimer);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.tag !== this.props.tag) {
            this.loadAll(nextProps);
        }
    }

    render() {
        const {
            height,
            heights,
            isExpanded,
            isOverflow,
            newArticle,
            showInput,
            showMore,
            showImage = {},
            currentTagIdx,
            currentTag,
            taglist,
            viewerWidth,
            windowWidth,
        } = this.state;
        const { articleStore, appState } = this.props.stores;
        const { currentEmail, isAdmin, isExpert, jwtToken, apiServer } = appState;
        const { artlistLive } = articleStore;
        const { imageDomain, imageDomainPath, artid, tag } = this.props;
        let finalArtlist;
        if (showMore) {
            finalArtlist = artlistLive.slice(0, artlistLive.length);
        } else {
            finalArtlist = artlistLive.slice(0, MAX_ARTICLE_TO_SHOW);
        }
        const apiUrl = `/api/fileupload/?category=${newArticle.category || 'no-category'}`
            + `&title=${encodeURIComponent(newArticle.title) || 'no-title'}`;
        const location = window.location;

        return (<>
            {isAdmin && <>
                {showInput ? <>
                    <button type='button' class='btn btn-sm btn-link float-right' onClick={this.toggleInput}>
                        <i class='fas fa-times'></i> Avbryt
                    </button>
                </> : <>
                    <button type='button' class='btn btn-sm btn-primary float-right' onClick={this.toggleInput}>
                        <i class='fas fa-plus'></i> Nytt innlegg
                    </button>
                </>}
            </>}
            <h3 class='border-bottom pb-2'>Siste</h3>
            {/* {JSON.stringify(artlist)} */}
            {isAdmin && <>
                {showInput && <>
                    <div class='d-flex flex-column justify-content-start overflow-auto mb-5'>
                        <div class='bg-primary text-white px-3 py-1'>
                            <h5>Legg til innlegg</h5>
                        </div>
                        <div class='form-group'>
                            <label for='tittelInput'>Tittel</label>
                            <input
                                type='text'
                                class='form-control'
                                id='tittelInput'
                                placeholder='Fin tittel...'
                                onInput={linkState(this, 'newArticle.title')}
                                value={newArticle.title}
                            />
                        </div>
                        <div class='form-group'>
                            <label for='publishedinput'>Publiseringsdato</label>
                            <input
                                type='datetime-local'
                                class='form-control'
                                id='publishedinput'
                                placeholder='Publiseringsdata'
                                onInput={linkState(this, 'newArticle.published')}
                                value={newArticle.published}
                            />
                        </div>
                        <div class='form-group'>
                            <label for='urlInput'>URL</label>
                            <input
                                type='text'
                                class='form-control'
                                id='urlInput'
                                placeholder='Youtube, Spotify eller annen URL...'
                                onInput={linkState(this, 'newArticle.url')}
                                value={newArticle.url}
                            />
                        </div>
                        <div class='form-group'>
                            <div class='w-50 float-right d-flex justify-content-end'>
                                <button
                                    type='button'
                                    class='btn btn-sm btn-secondary ml-2'
                                    onClick={this.handleInsertContent}
                                    data-content='
# Overskrift 1
'
                                >
                                    <i class='fa-solid fa-h1' />
                                </button>
                                <button
                                    type='button'
                                    class='btn btn-sm btn-secondary ml-2'
                                    onClick={this.handleInsertContent}
                                    data-content='
## Overskrift 2
'
                                >
                                    <i class='fa-solid fa-h2' />
                                </button>
                                <button
                                    type='button'
                                    class='btn btn-sm btn-secondary ml-2'
                                    onClick={this.handleInsertContent}
                                    data-content='
### Overskrift 3
'
                                >
                                    <i class='fa-solid fa-h3' />
                                </button>
                                <button
                                    type='button'
                                    class='btn btn-sm btn-secondary ml-2'
                                    onClick={this.handleInsertContent}
                                    data-content='
__fet__
'
                                >
                                    <i class='fa-solid fa-bold' />
                                </button>
                                <button
                                    type='button'
                                    class='btn btn-sm btn-secondary ml-2'
                                    onClick={this.handleInsertContent}
                                    data-content='
__kursiv__
'
                                >
                                    <i class='fa-solid fa-italic' />
                                </button>
                                <button
                                    type='button'
                                    class='btn btn-sm btn-secondary ml-2'
                                    onClick={this.handleInsertContent}
                                    data-content='
– '
                                >
                                    <i class='fa-solid fa-minus' />
                                </button>
                                <button
                                    type='button'
                                    class='btn btn-sm btn-secondary ml-2'
                                    onClick={this.handleInsertContent}
                                    data-content='
[tittel](url)
'
                                >
                                    <i class='fa-solid fa-link' />
                                </button>
                                <button
                                    type='button'
                                    class='btn btn-sm btn-secondary ml-2'
                                    onClick={this.handleInsertContent}
                                    data-content='
- linje1
- linje2
- linje3
'
                                >
                                    <i class='fa-solid fa-list' />
                                </button>
                                <button
                                    type='button'
                                    class='btn btn-sm btn-secondary ml-2'
                                    onClick={this.handleInsertContent}
                                    data-content='
1. linje1
2. linje2
3. linje3
'
                                >
                                    <i class='fa-solid fa-list-ol' />
                                </button>
                                <button
                                    type='button'
                                    class='btn btn-sm btn-secondary ml-2'
                                    onClick={this.handleInsertContent}
                                    data-content='
- [x] Write the press release
- [ ] Update the website
- [ ] Contact the media
'
                                >
                                    <i class='fa-solid fa-list-check' />
                                </button>
                                <button
                                    type='button'
                                    class='btn btn-sm btn-secondary ml-2'
                                    onClick={this.handleInsertContent}
                                    data-content='
```javascript
const a = 1;
```
'
                                >
                                    <i class='fa-solid fa-code' />
                                </button>
                                {/* <button
                                    type='button'
                                    class='btn btn-secondary ml-2'
                                    onClick={this.handleInsertContent}
                                    data-content='
> blockquote
'
                                >
                                    <i class='fa-solid fa-quotes' />
                                </button> */}
                            </div>
                            <label for='bodyInput'>Innhold</label>
                            <textarea
                                class='form-control'
                                id='bodyInput'
                                rows='10'
                                name='body'
                                onInput={linkState(this, 'newArticle.body')}
                                value={newArticle.body}
                                ref={c => this.currentTextarea = c}
                            />
                        </div>
                        {newArticle && newArticle.img && <>
                            <div class='form-group'>
                                {newArticle.img.map((img, idx) => {
                                    return (
                                        <div class='d-flex w-100 justify-content-between'>
                                            <button class='btn btn-danger btn-sm' data-image={idx} onClick={this.handleRemoveImageClick}>X</button>
                                            <div class='d-flex w-100 justify-content-between'>
                                                {img.src && <img src={`${imageDomain}/220x/${imageDomainPath}/${img.src}`} style='max-height: 150px;'  class='img-fluid' onError={this.handleImageErrored} />}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>}
                        <div class='form-group'>
                            <label for='imageInput'>Bilder</label>
                            <ImageUpload
                                apiUrl={apiUrl}
                                apiServer={apiServer}
                                jwtToken={jwtToken}
                                handleAddImage={this.handleAddImage}
                            />
                        </div>
                        <div class='form-group'>
                            <label for='tagsInput'>Tagger</label>
                            <input type='text' class='form-control' id='tagsInput' placeholder='Tags'
                                name='tagSearch'
                                onInput={e => this.handleTagsInput(e, this.handleInput)}
                                onKeydown={e => this.handleKeydown(e, this.handleInput, taglist)}
                                value={currentTag || newArticle.tagSearch} />

                            {Array.isArray(taglist) && taglist.map((tag, idx) =>
                                <span class={`badge badge-${currentTagIdx === idx ? 'warning' : 'light'} mr-1`}
                                    onClick={e => this.handleTagAdd(e, this.handleInput, tag.title)}
                                >{tag.title} <small class='text-muted'>({tag.count})</small> <i class='fas fa-plus' /></span>
                            )}

                            {Array.isArray(newArticle.tags) && newArticle.tags.map(tag =>
                                <span class='badge badge-info mr-1'>{tag} <i class='fas fa-times-circle'
                                    onClick={e => this.handleTagRemove(e, this.handleInput, tag)}
                                /></span>
                            )}
                        </div>
                        <button type='button' class='btn btn-block btn-primary' onClick={this.createArticle}>
                            <i class='fas fa-save'></i> Lagre
                        </button>
                    </div>
                </>}
            </>}

            {tag && <>
                <div class='bg-light d-flex mb-2 rounded-lg p-3'>
                    <div class='bg-light text-white rounded-lg pt-2' style='background-color: #d0d0d0 !important;'>
                        <i class='fa-solid fa-hashtag mx-2' style='font-size: 2.0em;' />
                    </div>
                    <div class='flex-grow-1 p-1 d-flex justify-content-between'>
                        <div class='flex-grow-1'>
                            <strong>{tag}</strong>
                        </div>
                        <div class=''>
                            <a class='text-white' href={`${location.origin}${location.pathname}#/live/`} style='background-color: #d0d0d0 !important;'>
                                <i class='fa-solid fa-circle-xmark' style='font-size: 1.5em;' />
                            </a>
                        </div>
                    </div>
                </div>
            </>}

            <div
                class='d-flex flex-column overflow-auto'
                ref={c => this.imageContainer = c}
            >
                {finalArtlist && finalArtlist.map((art, i) => {
                    const dateDiff = util.dateDiff(art.published, new Date());
                    const inFuture = dateDiff.seconds < 0;
                    const inThePast = dateDiff.seconds > 0;
                    const isToday = dateDiff.hours <= 6 && !inFuture;
                    const isThisWeek = dateDiff.days < 7;
                    const isThisYear = dateDiff.years >= 0 && dateDiff.months <= 6;
                    const isLast24Hours = dateDiff.hours <= 24 && !inFuture;
                    const hasOnlyOneImage = art.img.length === 1;
                    const imageWidth = windowWidth > 800 ? Math.floor(viewerWidth / 2) : viewerWidth;
                    return (<>
                        <div
                            class={`col-12 px-0 mb-0 pl-3 animate is-hidden`}
                            style={`
                                ${art.id === parseInt(artid, 10) ? 'background-color: #f0f0f0;' : ''}
                                ${inFuture ? 'opacity: 0.5;' : ''}
                            `}
                            ref={c => this.blockRefs[art.id] = c}
                            data-id={art.id}
                        >
                            {/* dateDiff: {JSON.stringify(dateDiff)} */}
                            {/* <div
                                class='px-2 rounded-lg bg-live-dark text-live-light'
                                style='font-size: 1.2em;'
                            >
                                {art.title}
                            </div> */}
                            <div class='body px-2 pt-2 pl-3 d-flex flex-column position-relative' style='border-left: 1px #a0a0a0 solid; font-size: 1.0em;'>
                                <div class='position-absolute' style='top: 5px; left: -10px; z-index: 1000;'>
                                    <span class='badge badge-pill badge-danger py-0 px-1' style='width: 20px; height: 20px; border: 3px #ffffff solid;'>&nbsp;</span>
                                </div>
                                <small class='text-danger font-weight-normal'>
    {/* {dateIsInTheFuture ? util.formatDate(story.date, { locale: 'no-NB', hour12: false, hour: '2-digit', minute: '2-digit' }) : util.formatDistance(story.date, new Date(), { locale: 'no-NB' })} */}

                                    {isLast24Hours ? <>
                                        {util.formatDistance(art.published, new Date(), { locale: 'no-NB' })} ago<br />
                                    </> : <>
                                        {isThisYear ? <>
                                            {isToday ? util.formatDate(art.published, {
                                                locale: 'nb',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            }, true) : util.formatDate(art.published, {
                                                locale: 'nb',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                day: 'numeric',
                                                month: 'short',
                                            }, true)}
                                        </> : <>
                                            {util.formatDate(art.published, {
                                                locale: 'nb',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                            }, true)}
                                        </>}
                                    </>}

                                </small><br />
                                <div class='w-100 mb-1'>
                                    <h5 class='mb-1 mt-0' style='font-size: 1.15em;'>{art.title}</h5>
                                    {/* windowWidth: {windowWidth}<br />
                                    viewerWidth: {viewerWidth}<br />
                                    Math.floor(viewerWidth / 2): {Math.floor(viewerWidth / 2)}<br /> */}
                                    {art.img && art.img[0] && <>
                                        <div
                                            class={`w-100 position-relative overflow-auto float-right`}
                                            style={`max-width: ${imageWidth}px !important;`}
                                        >
                                            <div
                                                class='d-flex flex-row flex-nowrap no-scrollbar'
                                                style={`
                                                    overflow-x: auto;
                                                    overflow-y: auto;
                                                    scroll-snap-type: x mandatory;
                                                `}
                                                ref={c => this.imageScrollerRef = c}
                                            >
                                                {art.img.map((img, idx) => {
                                                    return(<>
                                                        <div class='w-100 image is-hidden animate'>
                                                            <div
                                                                class={`w-100 h-100 d-flex justify-content-center align-items-center position-relative px-1`}
                                                                style={`
                                                                    scroll-snap-align: start;
                                                                    flex-wrap: wrap;
                                                                `}
                                                                onTouchStart={(e) => { e.stopPropagation(); }}
                                                                onTouchEnd={(e) => { e.stopPropagation(); }}
                                                                onTouchMove={(e) => { e.stopPropagation(); }}
                                                            >
                                                                <div
                                                                    class='d-flex flex-row flex-nowrap h-100 w-100 justify-content-center align-items-center overflow-hidden'
                                                                >
                                                                    <img
                                                                        src={`${imageDomain}/800x/${imageDomainPath}/${art.img[idx].src}`}
                                                                        style={`width: ${(hasOnlyOneImage ? imageWidth : imageWidth - 80)}px;`}
                                                                        onClick={(e) => this.toggleShowImage(e, art.id)}
                                                                    /><br />
                                                                    <small class='text-muted'>
                                                                        {art.img[0].title}<br />
                                                                        <span class='font-weight-lighter'>{art.img[idx].text}</span>
                                                                    </small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>);
                                                })}
                                            </div>
                                            {!hasOnlyOneImage && <>
                                                <div class='position-absolute' style='top: 50%; left: 10px;'>
                                                    <button type='button' class={`btn btn-link text-white`} style={`font-size: 3.5em; opacity: 0.7;`} onClick={this.onClickScrollLeft}><i class='fas fa-arrow-circle-left' /></button>
                                                </div>
                                                <div class='position-absolute' style='top: 50%; right: 10px;'>
                                                    <button type='button' class={`btn btn-link text-white`} style={`font-size: 3.5em; opacity: 0.7;`} onClick={this.onClickScrollRight}><i class='fas fa-arrow-circle-right' /></button>
                                                </div>
                                            </>}
                                        </div>
                                    </>}
                                    {art.url && art.url.match(/spotify\.com/) && spotifyPodcast(art.url)}
                                    {art.url && (art.url.match(/youtube\.com/) || art.url.match(/youtu\.be/)) && youtubeVideo(art.url)}
                                    <Markdown markdown={`${art.ingress || art.body}`} markedOpts={MARKDOWN_OPTIONS} />
                                </div>
                                <div class='d-flex justify-content-between mb-3'>
                                    <div class='d-flex justify-content-start'>
                                        {Array.isArray(art.tags) && art.tags.map(t =>
                                            <a
                                                href={`${location.origin}${location.pathname}#/live/tag/${t}`}
                                                class={`badge ${t === tag ? 'badge-info text-white' : 'badge-light text-muted'} mr-1 d-flex align-items-center rounded-lg font-weight-normal`}
                                            >
                                                {t}
                                            </a>
                                        )}
                                    </div>
                                    <div class='d-flex justify-content-end'>
                                        <a class='text-muted ml-2' href={`${location.origin}${location.pathname}#/live/${art.id}`} target='_blank' rel='noopener'><i class='fa-solid fa-link' /></a>
                                        <a class='text-muted ml-2' href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${location.origin}${location.pathname}#/live/${art.id}`)}&t=${encodeURIComponent(art.title)}`} target='_blank' rel='noopener'><i class='fa-brands fa-facebook' /></a>
                                        <a class='text-muted ml-2' href={`mailto:?body=${encodeURIComponent(`Hei,

    Her kommer en artikkel som er delt med deg:
    `)}${encodeURIComponent(`${location.origin}${location.pathname}#/live/${art.id}`)}${encodeURIComponent(`

    Ha en fin dag :)
    ${window.location.hostname}

    `)}&subject=Tips:%20${encodeURIComponent(art.title)}`} target='_blank' rel='noopener'><i class='fa-solid fa-envelope' /></a>
                                    </div>
                                </div>
                                <div class='border'></div>
                                {showImage[art.id] && <>
                                    <div
                                        class='fixed-top w-100 h-100 d-flex flex-column justify-content-center align-items-center'
                                        style='
                                            z-index: 10000;
                                            background-color:rgba(0, 0, 0, 0.5);
                                        '
                                        // onTouchstart={(e) => { e.stopPropagation(); e.preventDefault() }}
                                        // onTouchend={(e) => { e.stopPropagation(); e.preventDefault() }}
                                        // onTouchmove={(e) => { e.stopPropagation(); e.preventDefault() }}
                                        onScroll={(e) => { e.stopPropagation(); e.preventDefault() }}
                                        onmousewheel={(e) => { e.stopPropagation(); e.preventDefault() }}
                                        onwheel={(e) => { e.stopPropagation(); e.preventDefault() }}
                                        onClick={(e) => this.toggleShowImage(e, art.id)}
                                    >
                                        <img
                                            src={`${imageDomain}/1024x/${imageDomainPath}/${art.img[0].src}`}
                                            class='img-fluid rounded-lg'
                                            style='max-height: 90vh;'
                                            onClick={(e) => this.toggleShowImage(e, art.id)}
                                        /><br />
                                        <small class='text-white mt-2'>
                                            {art.img[0].title}<br />
                                            <span class='font-weight-lighter'>{art.img[0].text}</span>
                                        </small>
                                        <div
                                            class='position-absolute text-white' style='top: 20px; right: 20px; z-index: 10001; font-size: 3.5em;'
                                        >
                                            <i class='fa-solid fa-xmark' />
                                        </div>
                                    </div>
                                </>}
                            </div>
                        </div>
                            {/* {isOverflow[art.id] && <>
                                {isExpanded[art.id] ? <>
                                    <button
                                        class='btn btn-block btn-sm btn-link text-dark'
                                        type='button'
                                        onClick={e => this.toggleSize(e, art.id)}
                                        >
                                        Vis mindre ^
                                    </button>
                                </> : <>
                                    <button
                                        class='btn btn-block btn-sm btn-link text-dark'
                                        type='button'
                                        onClick={e => this.toggleSize(e, art.id)}
                                    >
                                        Les mer v
                                    </button>
                                </>}
                            </>} */}
                    </>);
                })}

                <div class='d-flex justify-content-center'>
                    {finalArtlist.length <= artlistLive.length && <>
                        {showMore ? <>
                            <button
                                type='button'
                                class='btn btn-link'
                                onClick={this.toggleShowMore}
                            >
                                Vis færre
                            </button>
                        </> : <>
                            <button
                                type='button'
                                class='btn btn-link'
                                onClick={this.toggleShowMore}
                            >
                                Vis flere
                            </button>
                        </>}
                    </>}
                </div>
            </div>

        </>);
    }
}

export default Live;
