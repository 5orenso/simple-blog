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
    if ($content.match(/youtube/)) {
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
    if (url.match(/youtube/)) {
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
    return (<>
        <div class='embed-responsive embed-responsive-16by9'>
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
        };
        this.updateTimer = null;
        this.mainContainer = null;
    }

    loadAll = async (setLast, props = this.props) => {
        const { categoryWebtv, categoryWebtvId } = props;
        const { articleStore, appState } = this.props.stores;
        const { isAdmin, isExpert } = appState;
        await articleStore.loadArtlist({
            isAdmin,
            isExpert,
            loadAll: isAdmin ? 1 : undefined,
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
            viewArticle = artlistWebtv[0];
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
        const { showList = true } = this.props;
        const { height, heights, isExpanded, isOverflow, newArticle, showInput, showMore, viewArticle, viewAll } = this.state;
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
                            <div class='d-flex flex-column justify-content-start overflow-auto mb-5 w-100'>
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
                                                class='bg-live-dark text-live-light rounded-lg d-flex justify-content-center align-items-center overflow-hidden'
                                                style='
                                                    width: 30%;
                                                    max-height: 110px;
                                                '
                                            >
                                                <img src={youtubeThumb(art.youtube)} class='img-fluid' /><br />
                                            </div>
                                            <div
                                                class={`pl-2 bg-live-light text-live-dark rounded-right ${viewArticle?.id === art.id ? 'bg-info text-white' : ''}`}
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
                                                        {art.title}<br />
                                                    </strong>
                                                    {art.ingress && <>
                                                        {art.ingress}<br />
                                                    </>}
                                                    {/* {youtubeVideo(art.youtube)}<br /> */}
                                                    <small>
                                                        {isToday ? <>
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
