import { h, Component } from 'preact';
import util from 'preact-util';
import { observer } from 'mobx-preact';
import { Text, Localizer } from 'preact-i18n';
import Markdown from 'preact-markdown';
import linkState from 'linkstate';
import { route } from 'preact-router';

const RELOAD_INTERVAL_IN_SEC = 60;
const MAX_ARTICLE_TO_SHOW = 200;

function scrollTo(element, top = 0, left = 0) {
    // element.scrollTop = to;
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'start',
    });
}

function youtubeThumb($content, $size = 'medium') {
    if (typeof $content !== 'string') {
        return undefined;
    }
    let youtubeRegex;
    if ($content.match(/youtube\.com\/shorts/)) {
        // eslint-disable-next-line
        youtubeRegex = /(<p>|<br>|[\s\t\n]|^)*https*:\/\/(www\.)*youtube\.com\/shorts\/(([^?&\s<$]+)((\?|&)[^\s<$]+)*)/gi;
    } else if ($content.match(/youtube/)) {
        // eslint-disable-next-line
        youtubeRegex = /(<p>|<br>|[\s\t\n]|^)*https*:\/\/(www\.)*youtube\.com\/(.*?v=([^&\s<$]+)(&[^\s<$]+)*)/gi;
    } else if ($content.match(/youtu\.be/)) {
        // eslint-disable-next-line
        youtubeRegex = /(<p>|<br>|[\s\t\n]|^)*https*:\/\/(www\.)*youtu\.be\/(([^?&\s<$]+)((\?|&)[^\s<$]+)*)/gi;
    } else {
        return null;
    }
    const youtubeMatch = youtubeRegex.exec($content);
    const sizes = {
        xsmall: 'default',
        small: 'mqdefault',
        medium: 'hqdefault',
        large: 'sddefault',
        max: 'maxresdefault',
    };
    let youtubeVideoThumb;
    if (typeof youtubeMatch === 'object' && Array.isArray(youtubeMatch)) {
        youtubeVideoThumb = `//img.youtube.com/vi/${youtubeMatch[4]}/${sizes[$size]}.jpg`;
    }
    return youtubeVideoThumb;
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

@observer
class WebTvView extends Component {
  	constructor(props) {
        super(props);
        this.state = {
            viewArticle: null,
            newArticle: {},
            viewAll: false,
            taglist: [],
            currentTagIdx: -1,
            currentTag: '',
        };
        this.updateTimer = null;
        this.mainContainer = null;
    }

    loadAll = async (setLast, props = this.props) => {
        const { categoryWebtv, categoryWebtvId, page, artid } = props;
        const { articleStore, appState } = this.props.stores;
        const { isAdmin, isExpert } = appState;
        await articleStore.loadArtlist({
            isAdmin,
            isExpert,
            loadUnpublished: isAdmin ? 1 : undefined,
            limit: 100,
            category: categoryWebtv,
            key: 'webtv',
        });

        if (setLast) {
            this.setLastVideo(props);
        }

        clearTimeout(this.updateTimer);
        this.updateTimer = setTimeout(() => {
            this.loadAll();
        }, RELOAD_INTERVAL_IN_SEC * 1000);

        if (page === 'webtv' && artid) {
            this.scrollToMainContainer();
        }
    }

    createArticle = async () => {
        const { newArticle } = this.state;
        const { categoryWebtv, categoryWebtvId } = this.props;
        const { appState, articleStore } = this.props.stores;
        const { currentEmail } = appState;

        await articleStore.createArticle({
            author: currentEmail,
            category: categoryWebtv,
            cateogryId: categoryWebtvId,
            status: 2,
            ...newArticle,
        });
        this.loadAll();
        this.setState({
            showInput: false,
            newArticle: {
                title: '',
                youtube: '',
                ingress: '',
                tags: [],
            },
        });
    }

    toggleInput = (e) => {
        const { showInput } = this.state;
        this.setState({
            showInput: !showInput,
        });
    }

    selectVideo = (e) => {
        const { id } = e.target.closest('.article').dataset;
        const { articleStore } = this.props.stores;
        const { artlistWebtv } = articleStore;
        const viewArticle = artlistWebtv.find((article) => article.id === parseInt(id, 10));
        this.setState({
            viewArticle,
        });
        this.scrollToMainContainer();
        route(`/webtv/${viewArticle.id}`);
    }

    setLastVideo = (props) => {
        const { artid, page } = props;
        const { articleStore } = this.props.stores;
        const { artlistWebtv } = articleStore;
        let viewArticle;
        if (page === 'webtv' && artid) {
            viewArticle = artlistWebtv.find((article) => article.id === parseInt(artid, 10));
        } else {
            const finalList = artlistWebtv.filter(art => {
                const dateDiff = util.dateDiff(art.published, new Date());
                const inFuture = dateDiff.seconds < 0;
                return !inFuture;
            });
            viewArticle = finalList[0];
        }
        this.setState({
            viewArticle,
        });
    }

    viewAll = () => {
        const { viewAll } = this.state;
        this.setState({
            viewAll: !viewAll,
        });
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
            if (taglist[currentTagIdx]) {
                currentTag = taglist[currentTagIdx].title;
            }
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

    toggleLargeView = () => {
        const { appState } = this.props.stores;
        const { subView } = appState;
        appState.setSubView(subView ? null : 'webtv');
    }

    scrollToMainContainer = () => {
        const { appState } = this.props.stores;
        const { subView } = appState;
        // console.log('scrollToMainContainer', view, this.mainContainer);
        if (this.mainContainer && !subView) {
            scrollTo(this.mainContainer);
        }
    }

    spiderPage = async () => {
        const { newArticle } = this.state;
        if (newArticle.youtube) {
            const value = newArticle.youtube;
            const urlResponse = await util.fetchApi(`/api/spider/${encodeURIComponent(value)}`, { publish: true, method: 'GET' }, {});

            if (urlResponse && urlResponse.status === 200) {
                newArticle.title = newArticle.title ? newArticle.title : urlResponse.data.title;
                newArticle.ingress = newArticle.ingress ? newArticle.ingress : urlResponse.data.description;
                newArticle.urlTitle = urlResponse.data.title;
                newArticle.urlDescription = urlResponse.data.description;
                newArticle.urlImage = urlResponse.data.image;
                newArticle.urlIcon = urlResponse.data.icon.match(/^(http|\/\/)/) ? urlResponse.data.icon : `${urlResponse.data.baseUrl}${urlResponse.data.icon}`;
                newArticle.urlBaseUrl = urlResponse.data.baseUrl;
                newArticle.urlThemeColor = urlResponse.data.themeColor;
                this.setState({ newArticle });
            }
        }
    }

    componentDidMount() {
        this.loadAll(true, this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.artid !== this.props.artid) {
            this.loadAll(true, nextProps);
        }
    }

    componentWillUnmount() {
        clearTimeout(this.updateTimer);
    }

    render() {
        const { showList = true, artid, tag } = this.props;
        const {
            height,
            heights,
            isExpanded,
            isOverflow,
            newArticle,
            showInput,
            showMore,
            viewArticle,
            viewAll,
            taglist,
            currentTagIdx,
            currentTag,
        } = this.state;
        const { appState, articleStore } = this.props.stores;
        const { currentEmail, isAdmin, isExpert, subView } = appState;
        const { artlistWebtv } = articleStore;

        let mainInFuture = false;
        if (viewArticle) {
            const mainDateDiff = util.dateDiff(viewArticle.published, new Date());
            mainInFuture = mainDateDiff.seconds < 0;
        }

        return (<>
            {(!showList || !subView) && <div class='row'>
                <div
                    class='w-100 d-flex flex-row justify-content-center' style='max-height: 80vh;'
                    style={`
                        ${mainInFuture ? 'opacity: 0.5;' : ''}
                    `}
                    ref={c => this.mainContainer = c}
                >
                    {viewArticle ? <>
                        {youtubeVideo(viewArticle.youtube)}
                    </> : <>
                        <div class='w-100 h-100 d-flex flex-row justify-content-center align-items-center'>
                            <div class='spinner-border text-light' role='status' style='width: 3rem; height: 3rem;'>
                                <span class='sr-only'>Loading...</span>
                            </div>
                        </div>
                    </>}
                    {/* <iframe
                        width="800"
                        height="448"

                        src="https://www.youtube.com/embed/mVef2v1OYhw"
                        title="YouTube video player"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen
                    /> */}
                </div>
                <button type='button' class='btn btn-block' onClick={this.toggleLargeView}>
                    {subView ? <><i class='fa-solid fa-square-minus' /> Vis mindre</> : <><i class='fa-solid fa-square-plus' /> Vis større</>}
                </button>
            </div>}
            {showList && <div class='row position-relative'>

                {isAdmin && <>
                    <div class='w-100 position-relative mt-3 mb-3'>
                        {showInput && <>
                            <div class='d-flex flex-column justify-content-start overflow-auto mb-5 w-100 p-4'>
                                <div class='bg-primary text-white px-3 py-1'>
                                    <h5>Legg til video</h5>
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
                                    <label for='youtubeInput'>Youtube</label>
                                    <input
                                        type='text'
                                        class='form-control'
                                        id='youtubeInput'
                                        placeholder='Youtube link...'
                                        onInput={linkState(this, 'newArticle.youtube')}
                                        onBlur={this.spiderPage}
                                        value={newArticle.youtube}
                                    />
                                </div>
                                <div class='form-group'>
                                    <label for='ingressInput'>Beskrivelse</label>
                                    <textarea
                                        class='form-control'
                                        id='ingressInput'
                                        rows='3'
                                        onInput={linkState(this, 'newArticle.ingress')}
                                        value={newArticle.ingress}
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
                    </div>
                </>}

                <div class='w-100 position-relative mt-3 mb-3'>
                    <div class={`d-flex flex-column`}>
                        {artlistWebtv.map(art => {
                            const dateDiff = util.dateDiff(art.published, new Date());
                            const inFuture = dateDiff.seconds < 0;
                            const inThePast = dateDiff.seconds > 0;
                            const isToday = dateDiff.hours <= 6 && !inFuture;
                            const isLast24Hours = dateDiff.hours <= 24 && !inFuture;
                            const isThisWeek = dateDiff.days < 7;
                            const isThisYear = dateDiff.years >= 0 && dateDiff.months <= 6;

                            return(<>
                                {/* dateDiff: {JSON.stringify(dateDiff)} */}
                                <div
                                    class={`w-100`}
                                    style={`
                                        line-height: 1.1em;
                                        ${inFuture ? 'opacity: 0.5;' : ''}
                                    `}
                                >
                                    <div
                                        class={`w-100 h-100 d-flex justify-content-center align-items-center position-relative p-1 article`}
                                        onClick={this.selectVideo}
                                        data-id={art.id}
                                    >
                                        <div class='d-flex flex-row flex-nowrap h-100 w-100'>
                                            <div
                                                class='bg-live-dark text-live-light rounded-lg d-flex justify-content-center align-items-center overflow-hidden ml-2'
                                                style='
                                                    width: 30%;
                                                    max-height: 110px;
                                                '
                                            >
                                                <img src={youtubeThumb(art.youtube)} class='img-fluid' /><br />
                                            </div>
                                            <div
                                                class={`pl-2 py-2 bg-live-light text-live-dark rounded-right mr-2 ${viewArticle?.id === art.id ? 'bg-info text-white' : ''}`}
                                                style='
                                                    width: 70%;
                                                    overflow: hidden;
                                                    text-overflow: ellipsis;
                                                    display: -webkit-box;
                                                    -webkit-line-clamp: 3; /* number of lines to show */
                                                            line-clamp: 3;
                                                    -webkit-box-orient: vertical;
                                                '
                                            >
                                                <small>
                                                    <strong>
                                                        <span class='d-flex flex-row justify-content-start'>
                                                            {art.urlIcon && !art.urlIcon.match(/undefined/) && <>
                                                                <img src={art.urlIcon} class='img-fluid mr-2' style='max-height: 1.5em;' /><br />
                                                            </>}
                                                            {art.title}<br />
                                                        </span>
                                                    </strong>
                                                    <div
                                                        style='
                                                            overflow: hidden;
                                                            text-overflow: ellipsis;
                                                            display: -webkit-box;
                                                            -webkit-line-clamp: 2; /* number of lines to show */
                                                                    line-clamp: 2;
                                                            -webkit-box-orient: vertical;
                                                        '
                                                    >
                                                        {art.ingress && <>
                                                            {art.ingress}<br />
                                                        </>}
                                                    </div>
                                                    {/* {youtubeVideo(art.youtube)}<br /> */}
                                                    <div class='d-flex justify-content-between mb-3'>
                                                        <small>
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
                                                        </small>
                                                        <div class='d-flex justify-content-start flex-wrap pr-2'>
                                                            {Array.isArray(art.tags) && art.tags.map(t =>
                                                                <a
                                                                    href={`${location.origin}${location.pathname}#/live/tag/${t}`}
                                                                    class={`badge ${t === tag ? 'badge-info text-white' : 'badge-light text-muted'} mr-1 d-flex align-items-center rounded-lg font-weight-normal`}
                                                                >
                                                                    {t}
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {/* {isAdmin && <>
                                                        <br />
                                                        <a href={`/#/webtv/${art.id}`} native target='_blank'>&raquo; Link</a>
                                                    </>} */}
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>);
                        })}
                    </div>
                </div>

                {isAdmin && <>
                    {showInput ? <>
                        <button type='button' class='btn btn-sm btn-link position-absolute' style='top: 10px; right: 0px; z-index: 10000;' onClick={this.toggleInput}>
                            <i class='fas fa-times'></i> Avbryt
                        </button>
                    </> : <>
                        <button type='button' class='btn btn-sm btn-primary position-absolute' style='top: 10px; right: 0px;' onClick={this.toggleInput}>
                            <i class='fas fa-plus'></i> Ny video
                        </button>
                    </>}
                </>}

            </div>}

        </>);
    }
}

export default WebTvView;
