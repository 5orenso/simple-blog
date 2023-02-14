import { h, Component } from 'preact';
import util from 'preact-util';
import { observer } from 'mobx-preact';
import { Text, Localizer } from 'preact-i18n';
import Markdown from 'preact-markdown';
import linkState from 'linkstate';
import { route } from 'preact-router';

import ImageUpload from '../form/imageUpload';

const RELOAD_INTERVAL_IN_SEC = 60;
const MAX_ARTICLE_TO_SHOW = 50;

const MARKDOWN_OPTIONS = {
	pedantic: false,
	gfm: true,
	breaks: true,
	sanitize: false,
	smartLists: true,
	smartypants: true,
	xhtml: true,
};

function scrollTo(element, top = 0, left = 0) {
    console.log(element)
    // element.scrollTop = to;
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'start',
    });
}

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

function articleCarousel(art, props, width = 300) {
    if (!art) {
        return '';
    }

    return (<>
        {art.img.map((img, idx) => {
            return(<>
                <div
                    class=''
                    style={``}
                >
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
                        <div class='d-flex flex-row flex-nowrap h-100 w-100 align-items-center overflow-hidden'>
                            <img src={articleImg(img, props, '1024x')} class='' style={`width: ${width}px; max-height: 80vh;`} />
                        </div>
                        {img.title && <div class='d-flex w-100 justify-content-center position-absolute text-live-light font-weight-lighter' style='bottom: 10px; left: 0px;'>
                            <Markdown markdown={`<strong>${img.title}</strong><br />${img.text || ''}`} markedOpts={MARKDOWN_OPTIONS} />
                        </div>}
                    </div>
                </div>
            </>);
        })}
    </>);
}


// Types for props
type ExpandableProps = {
    stores: {
        appState: any;
        articleStore: any;
    };
    categoryPhoto: string;
    categoryPhotoId: number;
    showList: boolean;
    imageDomain: string;
    imageDomainPath: string;
    artid: number;
};

// Types for state
type ExpandableState = {
    viewArticle: object;
    newArticle: object;
    showImage: object;
    viewerWidth: number;
    viewAll: boolean;
    showInput: boolean;
};

@observer
class PhotoView extends Component<ExpandableProps, ExpandableState> {
    updateTimer: null | ReturnType<typeof setTimeout> = null;
    imageContainer: HTMLElement;
    imageScrollerRef: HTMLElement;

  	constructor(props) {
        super(props);
        this.state = {
            viewArticle: null,
            newArticle: {},
            showImage: {},
        };
        this.updateTimer = 0;
        this.imageContainer = null;
        this.imageScrollerRef = null;
    }

    loadAll = async (setLast, props = this.props) => {
        const { categoryPhoto, categoryPhotoId } = props;
        const { articleStore, appState } = this.props.stores;
        const { isAdmin, isExpert } = appState;
        await articleStore.loadArtlist({ isAdmin, isExpert, limit: 100, category: categoryPhoto, key: 'photo' });

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
        this.scrollToMainContainer();
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

    viewAll = () => {
        const { viewAll } = this.state;
        this.setState({
            viewAll: !viewAll,
        });
    }

    getWidth = () => {
        this.setState({
            // viewerWidth: this.imageContainer?.offsetWidth > 1024 ? 1024 : this.imageContainer?.offsetWidth,
            viewerWidth: this.imageContainer?.offsetWidth,
        });
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


    toggleLargeView = () => {
        const { appState } = this.props.stores;
        const { subView } = appState;
        appState.setSubView(subView ? null : 'photo');
    }

    toggleShowImage = (e, imgid) => {
        e.stopPropagation();
        const { showList = true } = this.props;
        if (!showList) {
            return;
        }
        const { showImage } = this.state;
        showImage[imgid] = !showImage[imgid];
        this.setState({
            showImage,
        });
    }

    scrollToMainContainer = () => {
        const { appState } = this.props.stores;
        const { subView } = appState;
        // console.log('scrollToMainContainer', view, this.mainContainer);
        if (this.imageContainer) {
            scrollTo(this.imageContainer);
        } else {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth'
            });
        }
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

    componentDidMount() {
        this.loadAll(true, this.props);
        this.getWidth();
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
        const { showList = true, imageDomain, imageDomainPath } = this.props;
        const { newArticle, showInput, viewArticle, viewAll, viewerWidth, showImage } = this.state;
        const { appState, articleStore } = this.props.stores;
        const { currentEmail, isAdmin, isExpert, subView, jwtToken, apiServer } = appState;
        const { artlistPhoto } = articleStore;

        const hasOnlyOneImage = viewArticle?.img?.length === 1;

        const apiUrl = `/api/fileupload/?category=${newArticle.category || 'no-category'}`
            + `&title=${encodeURIComponent(newArticle.title) || 'no-title'}`;
        const location = window.location;

        return (<>
            {(!showList || !subView) && <div class='row'>
                <div
                    class='w-100 position-relative bg-dark pt-1'
                    ref={c => this.imageContainer = c}
                >
                    {viewArticle ? <>
                        <div class='w-100 position-relative overflow-auto'>
                            <div
                                class='d-flex flex-row flex-nowrap no-scrollbar'
                                style={`
                                    overflow-x: auto;
                                    overflow-y: auto;
                                    scroll-snap-type: x mandatory;
                                `}
                                ref={c => this.imageScrollerRef = c}
                            >
                                {viewArticle.img.map((img, idx) => {
                                    return(<>
                                        <div
                                            class='w-100'
                                            style={``}
                                        >
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
                                                    // style={`max-height: 90vh;`}
                                                    // style={`
                                                    //     object-fit: contain;
                                                    //     position: relative;
                                                    //     top: 50%;
                                                    //     transform: translateY(-50%);
                                                    // `}
                                                >
                                                    <img
                                                        src={articleImg(img, this.props, '1920x')}
                                                        class=''
                                                        style={`width: ${(hasOnlyOneImage ? viewerWidth : viewerWidth - 80)}px;`}
                                                        onClick={(e) => this.toggleShowImage(e, img._id)}
                                                    />
                                                </div>
                                                {img.title && <div class='d-flex w-100 justify-content-center position-absolute text-live-light font-weight-lighter' style='bottom: 10px; left: 0px;'>
                                                    <Markdown markdown={`<strong>${img.title}</strong><br />${img.text || ''}`} markedOpts={MARKDOWN_OPTIONS} />
                                                </div>}
                                            </div>
                                        </div>
                                        {showImage[img._id] && <>
                                            <div
                                                class='fixed-top w-100 h-100 d-flex flex-column justify-content-center align-items-center'
                                                style='
                                                    z-index: 10000;
                                                    background-color:rgba(0, 0, 0, 0.5);
                                                '
                                                // onTouchStart={(e) => { e.stopPropagation(); e.preventDefault() }}
                                                // onTouchend={(e) => { e.stopPropagation(); e.preventDefault() }}
                                                // onTouchmove={(e) => { e.stopPropagation(); e.preventDefault() }}
                                                onScroll={(e) => { e.stopPropagation(); e.preventDefault() }}
                                                onmousewheel={(e) => { e.stopPropagation(); e.preventDefault() }}
                                                onwheel={(e) => { e.stopPropagation(); e.preventDefault() }}
                                                onClick={(e) => this.toggleShowImage(e, img._id)}
                                            >
                                                <img
                                                    src={`${this.props.imageDomain}/1280x/${this.props.imageDomainPath}/${img.src}`}
                                                    class='img-fluid rounded-lg'
                                                    style='max-height: 90vh;'
                                                    onClick={(e) => this.toggleShowImage(e, img._id)}
                                                /><br />
                                                <small class='text-white mt-2'>
                                                    {img.title && <div class='d-flex w-100 justify-content-center position-absolute text-live-light font-weight-lighter' style='bottom: 10px; left: 0px;'>
                                                        <Markdown markdown={`<strong>${img.title}</strong><br />${img.text || ''}`} markedOpts={MARKDOWN_OPTIONS} />
                                                    </div>}
                                                </small>
                                                <div
                                                    class='position-absolute text-white' style='top: 20px; right: 20px; z-index: 10001; font-size: 3.5em;'
                                                >
                                                    <i class='fa-solid fa-xmark' />
                                                </div>
                                            </div>
                                        </>}
                                    </>);
                                })}
                            </div>
                        </div>
                        {!hasOnlyOneImage && <>
                            <div class='position-absolute' style='top: 50%; left: 10px;'>
                                <button type='button' class={`btn btn-link text-white`} style={`font-size: 3.5em; opacity: 0.7;`} onClick={this.onClickScrollLeft}><i class='fas fa-arrow-circle-left' /></button>
                            </div>
                            <div class='position-absolute' style='top: 50%; right: 10px;'>
                                <button type='button' class={`btn btn-link text-white`} style={`font-size: 3.5em; opacity: 0.7;`} onClick={this.onClickScrollRight}><i class='fas fa-arrow-circle-right' /></button>
                            </div>
                        </>}
                    </> : <>
                        <div class='w-100 h-100 d-flex flex-row justify-content-center align-items-center'>
                            <div class='spinner-border text-light' role='status' style='width: 3rem; height: 3rem;'>
                                <span class='sr-only'>Loading...</span>
                            </div>
                        </div>
                    </>}
                    {/* <iframe
                        width='800'
                        height='448'

                        src='https://www.youtube.com/embed/mVef2v1OYhw'
                        title='YouTube video player'
                        frameborder='0'
                        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                        allowfullscreen
                    /> */}
                    <button type='button' class='btn btn-block text-white' onClick={this.toggleLargeView}>
                        {subView ? <><i class='fa-solid fa-square-minus' /> Vis mindre</> : <><i class='fa-solid fa-square-plus' /> Vis større</>}
                    </button>
                </div>
            </div>}
            {showList && <div class='row position-relative'>

                {isAdmin && <>
                    <div class='w-100 position-relative mt-3 mb-3'>
                        {showInput && <>
                            <div class='d-flex flex-column justify-content-start overflow-auto mb-5 w-100'>
                                <div class='bg-primary text-white px-3 py-1'>
                                    <h5>Legg til fotoalbum</h5>
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
                                    <label for='ingressInput'>Beskrivelse</label>
                                    <textarea
                                        class='form-control'
                                        id='ingressInput'
                                        rows='3'
                                        onInput={linkState(this, 'newArticle.ingress')}
                                        value={newArticle.ingress}
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
                                <button type='button' class='btn btn-block btn-primary' onClick={this.createArticle}>
                                    <i class='fas fa-save'></i> Lagre
                                </button>
                            </div>
                        </>}
                    </div>
                </>}

                <div class='w-100 position-relative mt-3 mb-3'>
                    <div class={`d-flex flex-column`}>

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
                                    class={`w-100`}
                                    style={`
                                        line-height: 1.1em;
                                    `}
                                >
                                    <div
                                        class={`w-100 h-100 d-flex justify-content-center align-items-center position-relative p-1 article`}
                                        style={`
                                            scroll-snap-align: start;
                                            flex-wrap: wrap;
                                        `}
                                        onTouchStart={(e) => { e.stopPropagation(); }}
                                        onTouchEnd={(e) => { e.stopPropagation(); }}
                                        onTouchMove={(e) => { e.stopPropagation(); }}
                                        onClick={this.selectVideo}
                                        data-id={art.id}
                                    >
                                        <div class='d-flex flex-row flex-nowrap h-100 w-100'>
                                            <div
                                                class='bg-live-dark text-live-light rounded d-flex justify-content-center align-items-center overflow-hidden'
                                                style='
                                                    width: 30%;
                                                    max-height: 110px;
                                                '
                                            >
                                                {art.img && art.img[0] && <img src={articleImg(art.img[0], this.props, '400x')} class='img-fluid' />}<br />
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

                {isAdmin && <>
                    {showInput ? <>
                        <button type='button' class='btn btn-sm btn-link position-absolute' style='top: 10px; right: 0px; z-index: 10000;' onClick={this.toggleInput}>
                            <i class='fas fa-times'></i> Avbryt
                        </button>
                    </> : <>
                        <button type='button' class='btn btn-sm btn-primary position-absolute' style='top: 10px; right: 0px;' onClick={this.toggleInput}>
                            <i class='fas fa-plus'></i> Nytt fotoalbum
                        </button>
                    </>}
                </>}

            </div>}

        </>);
    }
}

export default PhotoView;
