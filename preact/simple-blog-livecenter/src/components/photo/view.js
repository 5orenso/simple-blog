import { h, Component } from 'preact';
import util from 'preact-util';
import { observer } from 'mobx-preact';
import { Text, Localizer } from 'preact-i18n';
import Markdown from 'preact-markdown';
import linkState from 'linkstate';
import { route } from 'preact-router';

const RELOAD_INTERVAL_IN_SEC = 60;
const MAX_ARTICLE_TO_SHOW = 50;

function articleImg(img, props, size = '150x') {
    if (typeof img !== 'object') {
        return undefined;
    }
    const imgSrc = `${props.imageDomain}/${size}/${props.imageDomainPath}/${img.src}`;
    return imgSrc;
    // https://litt.no/150x/litt.no/photo/drakkar-er-et-utrolig-flott-motiv/simpleBlog-0af2d2c0-2dd8-49c8-bbc1-24d2542c0407.jpg
    // https://litt.no/photo/drakkar-er-et-utrolig-flott-motiv/simpleBlog-0af2d2c0-2dd8-49c8-bbc1-24d2542c0407.jpg
    // if (typeof youtubeMatch === 'object' && Array.isArray(youtubeMatch)) {
    //     youtubeVideoThumb = `//img.youtube.com/vi/${youtubeMatch[4]}/${sizes[$size]}.jpg`;
    // }
    // return youtubeVideoThumb;

    //l3video.lemonwhale.com/i/i-95adc986-dda5-40e5-8810-91baaaf96487.jpg
}

function articleCarousel(art, props) {
    if (!art) {
        return '';
    }

    return (<>
        <div class='w-100 position-relative overflow-auto'>
            <div
                class='d-flex flex-row flex-nowrap no-scrollbar'
                style={`
                    overflow-x: auto;
                    overflow-y: auto;
                    scroll-snap-type: x mandatory;
                `}
            >
                {art.img.map((img, idx) => {
                    return(<>
                        <div
                            class='w-100'
                            style={`
                            `}
                        >
                            <div
                                class={`w-100 h-100 d-flex justify-content-center align-items-center position-relative p-1`}
                                style={`
                                    scroll-snap-align: start;
                                    flex-wrap: wrap;
                                `}
                                onTouchstart={(e) => { e.stopPropagation(); }}
                                onTouchend={(e) => { e.stopPropagation(); }}
                                onTouchmove={(e) => { e.stopPropagation(); }}
                            >
                                <div class='d-flex flex-row flex-nowrap h-100 w-100 align-items-center overflow-hidden'>
                                    <img src={articleImg(img, props, '1024x')} class='' style='max-width: 100vw;' />
                                </div>
                            </div>
                        </div>
                    </>);
                })}
            </div>
        </div>
    </>);
}

@observer
class PhotoView extends Component {
  	constructor(props) {
        super(props);
        this.state = {
            viewArticle: null,
            newArticle: {},

        };
        this.updateTimer;
    }

    loadAll = async (setLast, props = this.props) => {
        const { categoryPhoto, categoryPhotoId } = props;
        const { articleStore } = this.props.stores;
        await articleStore.loadArtlist({ limit: 10, category: categoryPhoto, key: 'photo' });

        if (setLast) {
            this.setLastPhoto(props);
        }

        clearTimeout(this.updateTimer);
        this.updateTimer = setTimeout(() => {
            this.loadAll();
        }, RELOAD_INTERVAL_IN_SEC * 1000);
    }

    createArticle = async () => {
        const { newArticle } = this.state;
        const { categoryPhoto, categoryPhotoId } = this.props;
        const { appState, articleStore } = this.props.stores;
        const { currentEmail } = appState;

        await articleStore.createArticle({
            author: currentEmail,
            category: categoryPhoto,
            cateogryId: categoryPhotoId,
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
        const { artlistPhoto } = articleStore;
        const viewArticle = artlistPhoto.find((article) => article.id === parseInt(id, 10));
        this.setState({
            viewArticle,
        });
        route(`/photo/${viewArticle.id}`);
    }

    setLastPhoto = (props) => {
        const { artid } = props;
        const { articleStore } = this.props.stores;
        const { artlistPhoto } = articleStore;
        let viewArticle;
        if (artid) {
            viewArticle = artlistPhoto.find((article) => article.id === parseInt(artid, 10));
        } else {
            viewArticle = artlistPhoto[0];
        }
        this.setState({
            viewArticle,
        });
    }

    componentDidMount() {
        this.loadAll(true, this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.artid !== this.props.artid) {
            this.loadAll(true, nextProps);
        }
    }

    render() {
        const { height, heights, isExpanded, isOverflow, newArticle, showInput, showMore, viewArticle } = this.state;
        const { appState, articleStore } = this.props.stores;
        const { currentEmail, isAdmin, isExpert } = appState;
        const { artlistPhoto } = articleStore;

        return (<>
            <div class='row'>
                <div class='w-100'>
                    {viewArticle ? <>
                        {articleCarousel(viewArticle, this.props)}
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
            </div>
            <div class='row position-relative'>

                <div class='w-100 position-relative mt-3 mb-3'>
                    <div
                        class='d-flex flex-row flex-nowrap no-scrollbar'
                        style={`
                            overflow-x: auto;
                            overflow-y: auto;
                            scroll-snap-type: x mandatory;
                        `}
                        onScroll={this.scrollBoxes}
                        ref={c => this.scrollerRef = c}
                    >
                        {artlistPhoto.map(art => {
                            const dateDiff = util.dateDiff(new Date(), art.updatedDate || art.published);
                            const dateEndDiff = util.dateDiff(new Date(), art.updatedDate || art.published);
                            const inFuture = dateDiff.seconds > 0;
                            const isThisWeek = dateDiff.days < 7;
                            const endInFuture = dateEndDiff.seconds > 0;
                            const isLiveNow = !inFuture && endInFuture;
                            const hasBeen = !inFuture && !endInFuture;

                            return(<>
                                <div
                                    class='col-5 col-md-4 col-lg-3 clearfix p-0 mr-2'
                                    style={`
                                        line-height: 1.1em;
                                    `}
                                    ref={c => this.elScrollerRef = c}
                                >
                                    <div
                                        class={`w-100 h-100 d-flex justify-content-center align-items-center position-relative p-1 article`}
                                        style={`
                                            scroll-snap-align: start;
                                            flex-wrap: wrap;
                                        `}
                                        onTouchstart={(e) => { e.stopPropagation(); }}
                                        onTouchend={(e) => { e.stopPropagation(); }}
                                        onTouchmove={(e) => { e.stopPropagation(); }}
                                        onClick={this.selectVideo}
                                        data-id={art.id}
                                    >
                                        <div class='d-flex flex-row flex-nowrap h-100 w-100'>
                                            <div
                                                class='bg-live-dark text-live-light rounded-left'
                                                style='
                                                    width: 40%;
                                                '
                                            >
                                                {art.img && art.img[0] && <img src={articleImg(art.img[0], this.props, '150x')} class='img-fluid' />}<br />
                                            </div>
                                            <div
                                                class='pl-2 bg-live-light text-live-dark rounded-right'
                                                style='
                                                    width: 60%;
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
                                                        {isThisWeek ? <>
                                                            {util.formatDate(art.updatedDate || art.published, {
                                                                locale: 'nb',
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                                weekday: 'short',
                                                            }, true)}
                                                        </> : <>
                                                            {util.formatDate(art.updatedDate || art.published, {
                                                                locale: 'nb',
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                                day: 'numeric',
                                                                month: 'short',
                                                            }, true)}
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
            </div>

        </>);
    }
}

export default PhotoView;
