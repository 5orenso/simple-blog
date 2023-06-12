import { h, Component } from 'preact';
import util from 'preact-util';
import { observer } from 'mobx-preact';
import { Text, Localizer } from 'preact-i18n';
import linkState from 'linkstate';
import { route } from 'preact-router';

function scrollTo(element, top = 0, left = 0) {
    // element.scrollTop = to;
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'start',
    });
}

const RELOAD_INTERVAL_IN_SEC = 60;
const TOTAL_ARTICLES = 30;

@observer
class Live extends Component {
  	constructor(props) {
        super(props);
        this.state = {
            left: 0,
            top: 0,
            x: 0,
            y: 0,
            hasContentLeft: false,
            hasContentRight: true,
        };
        this.updateTimer;
        this.contentContainer = null;
    }

    loadAll = async (props = this.props) => {
        const { categoryTicker, articleId } = props;
        const { articleStore, appState } = this.props.stores;
        const { isAdmin, isExpert } = appState;

        const { article } = articleStore;
        const category = articleId ? article['ticker-categoryTicker'] : categoryTicker;

        await articleStore.loadArtlist({
            isAdmin,
            isExpert,
            loadUnpublished: undefined,
            limit: TOTAL_ARTICLES,
            category,
            key: 'live',
        });

        clearTimeout(this.updateTimer);
        this.updateTimer = setTimeout(() => {
            this.loadAll();
        }, RELOAD_INTERVAL_IN_SEC * 1000);
    }

    getWidth = () => {
        this.setState({
            // viewerWidth: this.contentContainer?.offsetWidth > 1024 ? 1024 : this.contentContainer?.offsetWidth,
            viewerWidth: this.contentContainer?.offsetWidth,
            windowWidth: window.innerWidth,
        });
        // window.addEventListener('resize', (e) => {
        //     this.getWidth();
        // });
    }

    mouseDownHandler = (e) => {
        const ele = this.contentContainer;
        ele.style.cursor = 'grabbing';
        ele.style.userSelect = 'none';
        ele.style.removeProperty('scroll-snap-type');
        this.setState({
            // The current scroll
            left: ele.scrollLeft,
            top: ele.scrollTop,
            // Get the current mouse position
            x: e.clientX,
            y: e.clientY,
            hasMoved: false,
        });
        // console.log('mouseDownHandler', e.clientX, e.clientY);
        document.addEventListener('mousemove', this.mouseMoveHandler);
        document.addEventListener('mouseup', this.mouseUpHandler);
    }

    mouseMoveHandler = (e) => {
        const { left, top, x, y } = this.state;
        // How far the mouse has been moved
        const dx = e.clientX - x;
        const dy = e.clientY - y;


        // Scroll the element
        this.setState({
            left: left - dx,
            top: top - dy,
            x: e.clientX,
            y: e.clientY,
            hasMoved: true,
        }, () => {
            // Scroll the element
            const ele = this.contentContainer;
            ele.scrollTop = top - dy;
            ele.scrollLeft = left - dx;
        });
    }

    mouseUpHandler = () => {
        // document.removeEventListener('mousemove', mouseMoveHandler);
        // document.removeEventListener('mouseup', mouseUpHandler);
        const ele = this.contentContainer;
        ele.style.cursor = 'grab';
        ele.style.removeProperty('user-select');
        ele.style.scrollSnapType = 'x mandatory';
        document.removeEventListener('mousemove', this.mouseMoveHandler);
        document.removeEventListener('mouseup', this.mouseUpHandler);
    }

    onClickArticle = (e) => {
        const { hasMoved } = this.state;
        const { url } = e.target.closest('.article-card').dataset;
        console.log('onClickArticle', { url, hasMoved });
        if (!hasMoved) {
            window.location = url;
        }
    }

    onScroll = (e) => {
        const { scrollLeft, scrollWidth, clientWidth } = e.target;
        const maxScrollLeft = scrollWidth - clientWidth;
        // console.log('onScroll', { scrollLeft, clientWidth, maxScrollLeft });
        this.setState({
            hasContentLeft: scrollLeft > 0,
            hasContentRight: scrollLeft < maxScrollLeft,
        })
    }

    onClickScrollLeft = (e) => {
        const el = this.contentContainer;
        const width = parseInt((0 - el.clientWidth) * 0.5, 10);
        el.scrollBy({
            top: 0,
            left: width,
            behavior: 'smooth'
        });
    }

    onClickScrollRight = (e) => {
        const el = this.contentContainer;
        const width = parseInt(el.clientWidth * 0.5, 10);
        el.scrollBy({
            top: 0,
            left: width,
            behavior: 'smooth'
        });
    }


    componentDidMount() {
        this.loadAll();
        this.getWidth();
    }

    componentWillUnmount() {
        clearTimeout(this.updateTimer);
    }

    componentWillReceiveProps(nextProps) {
    }

    render() {
        const {
            viewerWidth,
            windowWidth,
            hasContentLeft,
            hasContentRight,
        } = this.state;
        const { articleStore, appState } = this.props.stores;
        const { artlistLive } = articleStore;
        const {
            height,
            arrowWidth = '20px',
            fadeWidth = '20px',
        } = this.props;

        return (<>
            {hasContentLeft && <div
                class='position-absolute d-flex flex-row align-items-center justify-content-center'
                style={`
                    top: 0;
                    left: 0;
                    height: ${height};
                    background-image: linear-gradient(to left, rgba(255,255,255,0), rgba(255,255,255,1));
                `}
                onClick={this.onClickScrollLeft}
            >
                <div
                    class='d-flex align-items-center justify-content-center text-muted'
                    style={`
                        width: ${arrowWidth};
                        height: ${height};
                        background-color: rgba(255,255,255,1);
                        color: #aaaaaa !important;
                    `}
                >
                    <i class='fa-solid fa-angle-left' />
                </div>
                <div
                    style={`
                        width: ${fadeWidth};
                        height: ${height};
                        background-image: linear-gradient(to left, rgba(255,255,255,0), rgba(255,255,255,1));
                    `}
                >&nbsp;</div>
            </div>}
            {hasContentRight && <div
                class='position-absolute d-flex flex-row'
                style={`
                    top: 0;
                    right: 0;
                    height: ${height};
                `}
                onClick={this.onClickScrollRight}
            >
                <div
                    style={`
                        width: ${fadeWidth};
                        height: ${height};
                        background-image: linear-gradient(to right, rgba(255,255,255,0), rgba(255,255,255,1));
                    `}
                >&nbsp;</div>
                <div
                    class='d-flex align-items-center justify-content-center text-muted'
                    style={`
                        width: ${arrowWidth};
                        height: ${height};
                        background-color: rgba(255,255,255,1);
                        color: #aaaaaa !important;
                    `}
                >
                    <i class='fa-solid fa-angle-right' />
                </div>
            </div>}
            <div
                class='overflow-auto d-flex flex-row flex-nowrap no-scrollbar align-items-center'
                style={`
                    scroll-snap-type: x mandatory;
                    cursor: grab;
                `}
                onMouseDown={this.mouseDownHandler}
                onScroll={this.onScroll}
                ref={c => this.contentContainer = c}
            >
                {artlistLive.map(art => {
                    const dateDiff = util.dateDiff(art.published, new Date());
                    const inFuture = dateDiff.seconds < 0;
                    const inThePast = dateDiff.seconds > 0;
                    const isToday = dateDiff.hours <= 6 && !inFuture;
                    const isThisWeek = dateDiff.days < 7;
                    const isThisYear = dateDiff.years >= 0 && dateDiff.months <= 6;
                    const isLast24Hours = dateDiff.hours <= 24 && !inFuture;
                    return (<>
                        <div
                            class='d-flex flex-column postion-relative article-card px-2'
                            style={`
                                display: block;
                                width: 250px;
                                min-width: 250px;
                                max-width: 250px;
                                scroll-snap-align: start;
                                flex-wrap: wrap;
                                border-right: 1px solid #ddd;
                            `}
                            data-url={art.url}
                            onClick={this.onClickArticle}
                        >
                            <div class='d-block-inline text-truncate w-100'>
                                {art.title}
                            </div>
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
                                </>} <span class='ml-1 font-weight-light text-muted'>{art.category}</span>

                            </small>
                        </div>
                    </>);
                })}
            </div>
        </>);
    }
}

export default Live;
