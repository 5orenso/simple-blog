import { h, Component } from 'preact';
import util from 'preact-util';
import { observer } from 'mobx-preact';
import { Text, Localizer } from 'preact-i18n';
import Markdown from 'preact-markdown';
import linkState from 'linkstate';

const MARKDOWN_OPTIONS = {
	pedantic: false,
	gfm: true,
	breaks: true,
	sanitize: false,
	smartLists: true,
	smartypants: true,
	xhtml: true,
};

const RELOAD_INTERVAL_IN_SEC = 60;
const MAX_ARTICLE_TO_SHOW = 10;

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
        };
        this.blockRefs = {};
        this.updateTimer;
    }

    loadAll = async () => {
        const { categoryLive, categoryLiveId } = this.props;
        const { articleStore, appState } = this.props.stores;
        const { isAdmin, isExpert } = appState;
        await articleStore.loadArtlist({ isAdmin, isExpert, limit: 100, category: categoryLive, key: 'live' });
        // this.checkHeights();

        clearTimeout(this.updateTimer);
        this.updateTimer = setTimeout(() => {
            this.loadAll();
        }, RELOAD_INTERVAL_IN_SEC * 1000);
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
                body: '',
            },
        });
    }

    componentDidMount() {
        this.loadAll();
    }

    componentWillUnmount() {
        clearTimeout(this.updateTimer);
    }

    render() {
        const { height, heights, isExpanded, isOverflow, newArticle, showInput, showMore, showImage = {} } = this.state;
        const { articleStore, appState } = this.props.stores;
        const { currentEmail, isAdmin, isExpert } = appState;
        const { artlistLive } = articleStore;
        const { imageDomain, imageDomainPath } = this.props;
        let finalArtlist;
        if (showMore) {
            finalArtlist = artlistLive.slice(0, artlistLive.length);
        } else {
            finalArtlist = artlistLive.slice(0, MAX_ARTICLE_TO_SHOW);
        }
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
                            <label for='bodyInput'>Innhold</label>
                            <textarea
                                class='form-control'
                                id='bodyInput'
                                rows='3'
                                onInput={linkState(this, 'newArticle.body')}
                                value={newArticle.body}
                            />
                        </div>
                        <button type='button' class='btn btn-block btn-primary' onClick={this.createArticle}>
                            <i class='fas fa-save'></i> Lagre
                        </button>
                    </div>
                </>}
            </>}

            <div class='d-flex flex-column overflow-auto'>
                {finalArtlist && finalArtlist.map((art, i) => {
                    const dateDiff = util.dateDiff(art.published, new Date());
                    // console.log(art.published, dateDiff);
                    const inThePast = dateDiff.seconds > 0;
                    const isToday = dateDiff.hours <= 6;
                    const isThisWeek = dateDiff.days < 7;
                    return (<>
                        <div
                            class='col-12 px-0 mb-0 pl-3'
                            style={`
                                transition: max-height 700ms ease-in-out;
                            `}
                            ref={c => this.blockRefs[art.id] = c}
                        >
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
                                <small class='text-danger font-weight-normal'>{
                                    isToday ? util.formatDate(art.published, {
                                        locale: 'nb',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    }, true) : util.formatDate(art.published, {
                                        locale: 'nb',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        day: 'numeric',
                                        month: 'short',
                                    }, true)
                                }</small><br />
                                <div class='w-100 mb-3'>
                                    <h5 class='mb-1 mt-0' style='font-size: 1.15em;'>{art.title}</h5>

                                    {art.img && art.img[0] && <>
                                        <div class='w-50 float-right pl-3'>
                                            <img
                                                src={`${imageDomain}/400x/${imageDomainPath}/${art.img[0].src}`}
                                                class='img-fluid'
                                                onClick={(e) => this.toggleShowImage(e, art.id)}
                                            /><br />
                                            <small class='text-muted'>
                                                {art.img[0].title}<br />
                                                <span class='font-weight-lighter'>{art.img[0].text}</span>
                                            </small>
                                        </div>
                                    </>}
                                    <Markdown markdown={`${art.ingress || art.body}`} markedOpts={MARKDOWN_OPTIONS} />
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
