import { h, Component } from 'preact';
import util from 'preact-util';
import { observer } from 'mobx-preact';

// function hasImage(img) {
//     return (util.isObject(img) && img.src);
// }

@observer
class ImageScroller extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageIdx: props.imageIdx || 0,
            imageElementScale: 1,
            imageElementMaxScale: 5,
            start: {},
        };
        this.imageScrollerRef;
    }

    scrollImages = (e) => {
        const { images, callback = () => {} } = this.props;
        const totalImages = images.length - 1;

        // scrollHeight: 705
        // scrollLeft: 564
        // scrollTop: 0
        // scrollWidth: 1692

        const { scrollLeft, scrollWidth, clientWidth } = e.target;
        const imageStep = clientWidth;
        const imageIdx = scrollLeft / imageStep;
        // console.log({ e, imageStep, imageIdx, scrollLeft, scrollWidth, clientWidth });

        const nearestInt = Math.round(imageIdx);
        const diff = Math.abs(nearestInt - imageIdx);
        // console.log({ nearestInt, diff });
        if (Number.isInteger(imageIdx) || diff < 0.1) {
            this.setState({
                imageIdx: nearestInt,
            });
            callback(nearestInt);
        }
    }

    scrollToImage = (imageIdx) => {
        const { imageScrollerRef } = this;
        const el = this.imageScrollerRef;
        if (el) {
            const width = el.clientWidth * imageIdx;
            setTimeout(() => {
                el.scrollBy({
                    top: 0,
                    left: width,
                    behavior: 'smooth'
                });
            }, 200);
        }
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

    distance = (event) => {
        return Math.hypot(event.touches[0].pageX - event.touches[1].pageX, event.touches[0].pageY - event.touches[1].pageY);
    }

    pinchZoomOnTouchStart = (event) => {
        // console.log('touchstart', event);
        if (event.touches.length === 2) {
            event.preventDefault(); // Prevent page scroll
            event.stopPropagation();

            // Calculate where the fingers have started on the X and Y axis
            const start = {};
            start.x = (event.touches[0].pageX + event.touches[1].pageX) / 2;
            start.y = (event.touches[0].pageY + event.touches[1].pageY) / 2;
            start.distance = this.distance(event);
            this.setState({ start });
        }
    }

    pinchZoomOnTouchMove = (event) => {
        // console.log('touchmove', event);
        let { imageElementScale, imageElementMaxScale } = this.state;
        const { start } = this.state;
        if (event.touches.length === 2) {
            event.preventDefault(); // Prevent page scroll
            event.stopPropagation();
            let scale;

            // Safari provides event.scale as two fingers move on the screen
            // For other browsers just calculate the scale manually
            if (event.scale) {
                scale = event.scale;
            } else {
            const deltaDistance = this.distance(event);
                scale = deltaDistance / start.distance;
            }

            imageElementScale = Math.min(Math.max(1, scale), imageElementMaxScale);
            this.setState({ imageElementScale }, () => {
                // Calculate how much the fingers have moved on the X and Y axis
                const deltaX = (((event.touches[0].pageX + event.touches[1].pageX) / 2) - start.x) * 2; // x2 for accelarated movement
                const deltaY = (((event.touches[0].pageY + event.touches[1].pageY) / 2) - start.y) * 2; // x2 for accelarated movement

                // Transform the image to make it grow and move with fingers
                const transform = `translate3d(${deltaX}px, ${deltaY}px, 0) scale(${imageElementScale})`;
                event.target.style.transition = '';
                event.target.style.transform = transform;
                event.target.style.WebkitTransform = transform;
                event.target.style.zIndex = '100000';
                // event.target.style.maxHeight = '';
                // event.target.style.maxWidth = '';
            });

        }
    }

    pinchZoomOnTouchEnd = (event) => {
        // console.log('touchend', event);
        // Reset image to it's original format
        this.setState({ imageElementScale: 1 });
        event.target.style.transition = 'transform 250ms';
        event.target.style.transform = '';
        event.target.style.WebkitTransform = '';
        event.target.style.zIndex = '';
        // event.target.style.maxHeight = '75vh';
        // event.target.style.maxWidth = '100%';
    }

    componentDidMount() {
        const { imageIdx } = this.props;
        if (imageIdx) {
            this.scrollToImage(imageIdx);
        }
    }

    render() {
        const { imageIdx, imageElementScale } = this.state;
        const {
            images = [],
            id,
            dblClick = () => {},
            onClick,
            likeRef = {},
            unlikeRef = {},
            noimagestext,
            minHeight = '100px',
            dotClasses,
            dotStyles,
            showImg,
            hasImage = () => true,
        } = this.props;
        const { appState } = this.props.stores;
        const { isCordova } = appState;
        const hasPrev = imageIdx > 0;
        const hasNext = imageIdx < images.length - 1;

        if (!images || images.length === 0) {
            if (noimagestext) {
                return (<>
                    <div class='col-12 text-center text-muted'>
                        <div class='display-1'>
                            <i class='fas fa-camera' />
                        </div>
                        <h3 class='font-weight-lighter'>
                            {noimagestext}
                        </h3>
                    </div>
                </>);
            }
            return <></>;
        }

        return (
            <div class='w-100 position-relative'>
                <div
                    class='d-flex flex-row flex-nowrap bg-light border-top border-bottom no-scrollbar'
                    style={`
                        overflow-x: ${imageElementScale > 1 && images.length === 1 ? 'visible !important' : 'auto'};
                        overflow-y: ${imageElementScale > 1 ? 'visible !important' : 'auto'};
                        scroll-snap-type: x mandatory;
                    `}
                    onScroll={this.scrollImages}
                    ref={c => this.imageScrollerRef = c}
                >
                    {images && images.filter(hasImage).map((img, idx) => (
                        <div class='col-12 clearfix p-0' key={`image-scroller-${idx}`}>
                            <div
                                class={`w-100 h-100 text-center rounded-lg imageContainer d-flex justify-content-center align-items-center position-relative `}
                                style={`
                                    scroll-snap-align: start;
                                    flex-wrap: wrap;
                                `}
                                // overflow: ${imageElementScale > 1 ? 'visible !important' : 'hidden'};
                                onDblclick={dblClick}
                                onClick={onClick}
                                data-id={id}
                                onTouchStart={e => { e.stopPropagation(); }}
                                onTouchEnd={e => { e.stopPropagation(); }}
                                onTouchMove={e => { e.stopPropagation(); }}
                            >
                                <div
                                    class='position-absolute w-100 h-100'
                                    style={`
                                        background-image: url('${showImg(img)}'); background-size: cover;
                                        filter: blur(10px);
                                        opacity: 0.5;
                                    `}
                                        // overflow-y: ${imageElementScale > 1 ? 'visible !important' : 'hidden'};
                                />
                                {img ? <img
                                    class='img-fluid position-relative'
                                    // alt={`May be an image of: ${mu.imageKeywords(img).join(', ')}`}
                                    src={showImg(img)}
                                    loading='lazy'
                                    style={`max-height: 75vh; min-height: ${minHeight}; ${idx !== imageIdx ? '' : ''}`}

                                    onTouchStart={this.pinchZoomOnTouchStart}
                                    onTouchEnd={this.pinchZoomOnTouchEnd}
                                    onTouchMove={this.pinchZoomOnTouchMove}
                                /> : <>
                                    <span class='display-1 text-muted'>
                                        <i class='fas fa-camera' />
                                    </span>
                                </>}

                                {img.title && <div class='position-absolute w-100 text-center' style='bottom: 0px; background-color: rgba(0, 0, 0, 0.5);'>
                                    {img.title}
                                </div>}

                                {/* <xmp>{JSON.stringify(img, null, 4)}</xmp> */}
                            </div>
                            {likeRef[id] && <span class='likeHeart position-absolute text-white display-1' style='top: calc(50% - 50px); left: calc(50% - 50px); width: 100px; height: 100px;'>
                                <i class='fa-solid fa-heart likeStory' />
                            </span>}
                            {unlikeRef[id] && <span class='unlikeHeart position-absolute text-white display-1' style='top: calc(50% - 50px); left: calc(50% - 50px); width: 100px; height: 100px;'>
                                <i class='fa-solid fa-heart-crack unlikeStory' />
                            </span>}
                        </div>
                    ))}
                </div>
                {images && images.length > 1 && <>
                    <div class={`w-100 text-center mt-2 ${dotClasses}`} style={dotStyles}>
                        <small>
                            <small>
                                {images && images.filter(hasImage).map((img, idx) => <>
                                    <i class={`${idx === imageIdx ? 'fa-solid' : 'fa-regular'} fa-circle mr-1 text-muted`} />
                                </>)}
                            </small>
                        </small>
                    </div>
                    <div
                        class='position-absolute text-white font-weight-lighter px-1 py-1 rounded-lg'
                        style='top: 10px; right: 10px; background-color: rgba(0, 0, 0, 0.3); line-height: 1.0em;'
                    >
                        <small>{imageIdx + 1} / {images.length}</small>
                    </div>
                </>}

                {isCordova ? <></> : <>
                    {hasPrev && <div
                        class='position-absolute d-none d-lg-block'
                        style={`top: 50%; left: 5px;`}
                    >
                        <button type='button' class={`btn btn-link text-muted`} style={`font-size: 3.0em; opacity: 0.7;`} onClick={this.onClickScrollLeft}><i class='fas fa-arrow-circle-left' /></button>
                    </div>}
                    {hasNext && <div
                        class='position-absolute d-none d-lg-block'
                        style={`top: 50%; right: 5px;`}
                    >
                        <button type='button' class={`btn btn-link text-muted`} style={`font-size: 3.0em; opacity: 0.7;`} onClick={this.onClickScrollRight}><i class='fas fa-arrow-circle-right' /></button>
                    </div>}
                </>}

            </div>
        );
    }
}

export default ImageScroller;
