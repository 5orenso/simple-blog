import { h, Component } from 'preact';
import util from 'preact-util';
import { observer } from 'mobx-preact';
import { Text, Localizer } from 'preact-i18n';
import Markdown from 'preact-markdown';
import linkState from 'linkstate';

const RELOAD_INTERVAL_IN_SEC = 60;
const MAX_ARTICLE_TO_SHOW = 10;

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
        console.log('match', match);
        console.log({ p0, p1, p2, p3, p4 });
        return p3;
    });
    // return youtubeVideo;
    return (<>
        <div class="embed-responsive embed-responsive-16by9">
            <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/${youtubeVideo}?rel=0" allowfullscreen></iframe>
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

        };
        this.updateTimer;
    }

    loadAll = async () => {
        const { categoryWebtv, categoryWebtvId } = this.props;
        const { articleStore } = this.props.stores;
        await articleStore.loadArtlist({ limit: 10, category: categoryWebtv, key: 'webtv' });
        const { artlistWebtv } = articleStore;
        this.setState({
            viewArticle: artlistWebtv[0],
        });

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
        const { artlistWebtv } = articleStore;
        const viewArticle = artlistWebtv.find((article) => article.id === id);
        this.setState({
            viewArticle,
        });
    }

    componentDidMount() {
        this.loadAll();
    }

    render() {
        const { height, heights, isExpanded, isOverflow, newArticle, showInput, showMore, viewArticle } = this.state;
        const { appState, articleStore } = this.props.stores;
        const { currentEmail, isAdmin, isExpert } = appState;
        const { artlistWebtv } = articleStore;

        return (<>
            <div class='row'>
                <div class='w-100 d-flex flex-row justify-content-center'>
                    {viewArticle ? <>
                        Spinner
                    </> : <>
                        {youtubeVideo(viewArticle.youtube)}
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

                <div class='w-100 position-relative mt-3'>
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
                        {artlistWebtv.map(art => {
                            return(<>
                                <div
                                    class='col-5 col-md-4 col-lg-3 clearfix p-0'
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
                                            <div class='' style='width: 40%;'>
                                                <img src={youtubeThumb(art.youtube)} class='img-fluid' /><br />
                                            </div>
                                            <div class='pl-2' style='width: 60%;'>
                                                <small>
                                                    <strong>
                                                        {art.title}<br />
                                                    </strong>
                                                    {art.ingress}<br />
                                                    {/* {youtubeVideo(art.youtube)}<br /> */}
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
                        <button type='button' class='btn btn-sm btn-primary position-absolute' style='top: 10px; right: 0px; z-index: 10000;' onClick={this.toggleInput}>
                            <i class='fas fa-plus'></i> Ny video
                        </button>
                    </>}
                </>}

            </div>

            {isAdmin && <>
                <div class='row'>
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
        </>);
    }
}

export default WebTvView;
