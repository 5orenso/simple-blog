import { h, Component } from 'preact';
import util from 'preact-util';
import { observer } from 'mobx-preact';
import { Text, Localizer } from 'preact-i18n';
import Markdown from 'preact-markdown';

import Live from '../components/live/';

function scrollTo(element, top = 0, left = 0) {
    // element.scrollTop = to;
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'start',
    });
    // element.scrollTo({
    //     top,
    //     left,
    //     behavior: 'smooth'
    // });
}

const  RELOAD_INTERVAL_IN_SEC = 1;

function pad(number) {
    let r = String(number);
    if (r.length === 1) {
        r = `0${r}`;
    }
    return r;
}

function getDateParts({ showDateOnly, showSeconds, showTimezone, showClockOnly }) {
    const now = new Date();
    const mm = now.getMonth() + 1;
    const dd = now.getDate();
    const yy = now.getFullYear();
    const hh = now.getHours();
    const mi = now.getMinutes();
    const ss = now.getSeconds();
    const tzo = -now.getTimezoneOffset();
    const dif = tzo >= 0 ? '+' : '-';

    let ret = `${pad(yy)}-${pad(mm)}-${pad(dd)}`;
    if (showClockOnly) {
        ret = '';
    }
    if (!showDateOnly) {
        ret += ` ${pad(hh)}:${pad(mi)}`;
        if (showSeconds) {
            ret += `:${pad(ss)}`;
        }
        if (showTimezone) {
            ret += `${dif}${tzo}`;
        }
    }
    return ret;
}

function calculateTimeLeft({ countdownto }) {
    let year = new Date().getFullYear();
    const difference = +new Date(`${countdownto}`) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
        timeLeft = {
            d: Math.floor(difference / (1000 * 60 * 60 * 24)),
            h: Math.floor((difference / (1000 * 60 * 60)) % 24),
            m: pad(Math.floor((difference / 1000 / 60) % 60)),
            s: pad(Math.floor((difference / 1000) % 60)),
        };
    } else {
        timeLeft = {
            d: 0,
            h: 0,
            m: 0,
            s: 0,
        };
    }
    return timeLeft;
}

@observer
class Start extends Component {
  	constructor(props) {
        super(props);
        this.state = {
            sessionid: new Date().getTime(),
        };
        this.mainContainer = null;
        this.updateTimer = null;
    }

    toggleMenu = () => {
        const { showMenu } = this.state;
        this.setState({
            showMenu: !showMenu,
        });
    }

    scrollToMainContainer = (view) => {
        // console.log('scrollToMainContainer', view, this.mainContainer);
        if (this.mainContainer) {
            scrollTo(this.mainContainer);
        }
    }

    loadAll = async (props = this.props) => {
        const { appState, articleStore } = this.props.stores;
        // appState.setMainViewCallback(this.scrollToMainContainer);
        const { page, articleId } = props;
        // if (showWebcam && showWebcam !== 'false') {
        //     appState.setMainView(page || 'webcam');
        // } else {
        if (articleId) {
            await articleStore.loadArticle(articleId);
        }
        this.tickTimer();
    }

    tickTimer = () => {
        const { articleStore } = this.props.stores;
        const { article } = articleStore; 
        const { articleId, raceDate } = this.props;
        const date = articleId ? article['ticker-raceDate'] : raceDate;
        
        if (!date) {
            return null;
        }        
        const timeLeft = calculateTimeLeft({ countdownto: date });
        // const timeNow = getDateParts({ showDateOnly, showSeconds, showTimezone, showClockOnly });
        const timerComponents = [];
        Object.keys(timeLeft).forEach((interval) => {
            if (timerComponents.length === 0 && !timeLeft[interval]) {
                return;
            }
            const isDay = interval === 'd';
            const isSec = interval === 's';
            timerComponents.push(<span>
                {timeLeft[interval]}<span class={`font-weight-light ${isDay ? 'mr-1' : ''}`}>{isDay ? 'd' : (isSec ? '' : ':')}</span>{" "}
            </span>);
        });
        
        this.setState({
            raceTime: timeLeft,
            timerComponents,
        });

        clearTimeout(this.updateTimer);
        this.updateTimer = setTimeout(() => {
            this.tickTimer();
        }, RELOAD_INTERVAL_IN_SEC * 1000);
    }

    onLogoClick = () => {
        const { tickerTitleUrl } = this.props;
        if (tickerTitleUrl) {
            window.location = tickerTitleUrl;
        }
    }

    componentWillMount() {
        this.loadAll();
    }

    componentDidMount() {

        // document.addEventListener('visibilitychange', () => {
        //     if (document.visibilityState === 'visible') {
        //         // page is visible
        //     } else {
        //         // page is hidden
        //     }
        // });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.page !== this.props.page || nextProps.artid !== this.props.artid) {
            this.loadAll(nextProps);
        }
    }

    componentWillUnmount() {
        clearTimeout(this.updateTimer);
    }

    render() {
        const {
            tickerTitle,
            tickerTitleUrl,
            raceDate,
            showCountDown,
            articleId,
            height = '60px',
            titleWidth = '100px',
            dateWidth = '100px',
            fontSize = '15px',
            countDownFontSize = '12px',
            dateFontSize = '12px',
            titleFontSize = '17px',
        } = this.props;
        const { raceTime, timerComponents } = this.state;
        const { appState, articleStore } = this.props.stores;
        const { article } = articleStore; 
        const { mainView, subView, currentEmail, isAdmin, isExpert, isDevelopment, path } = appState;

        const title = articleId ? article['ticker-tickerTitle'] : tickerTitle;
        const titleUrl = articleId ? article['ticker-tickerTitleUrl'] : tickerTitleUrl;
        const countDown = articleId ? article['ticker-showCountDown'] : showCountDown;
        const date = articleId ? article['ticker-raceDate'] : raceDate;

        return (<>
            <div 
                class='d-flex flex-row flex-nowrap position-relative w-100'
                style={`
                    height: ${height};
                    font-size: ${fontSize};
                `}
            >
                {title && <div 
                    class='position-absolute d-flex flex-column border-right'
                    style={`
                        top: 0; 
                        left: 0; 
                        width: ${titleWidth}; 
                        height: ${height};
                        border-right: 1px solid #888;
                    `}
                    onClick={this.onLogoClick}
                >
                    <div 
                        class='pl-2'
                        style={`
                            line-height: 1.1rem; 
                            font-size: ${titleFontSize};
                        `}
                    >
                        {titleUrl ? <>
                            <a href={titleUrl} native>
                                <div dangerouslySetInnerHTML={{__html: title}} />
                            </a>
                        </> : <>
                            <div dangerouslySetInnerHTML={{__html: title}} />
                        </>}
                    </div>
                    <div 
                        class='pl-2 flex-fill d-flex align-items-center' 
                        style={`
                            line-height: 1.0rem; 
                            font-size: ${dateFontSize};
                        `}
                    >
                        <i class='fa-solid fa-flag-checkered' /> {util.formatDate(date)}
                    </div>
                    <div 
                        class='text-white flex-fill d-flex align-items-center justify-content-center'
                        style={`
                            background-color: rgb(233, 90, 43);                            
                        `}
                    >
                        <div 
                            class='d-flex flex-row flex-nowrap justify-content-center align-items-center'
                            style={`
                                font-size: ${countDownFontSize};
                            `}
                        >
                            {timerComponents}
                        </div>
                    </div>
                </div>}

                <div 
                    class='w-100 overflow-hidden d-flex flex-row flex-nowrap position-relative' 
                    style={`
                        margin-left: ${titleWidth}; 
                    `}
                >
                    {articleId ? <>
                        {article.id ? <>
                            <Live stores={this.props.stores} {...this.props} height={height} />            
                        </> : <>
                            Loading...
                        </>}
                    </>: <>
                        <Live stores={this.props.stores} {...this.props} height={height} />
                    </>}
                </div>
                 
            </div>
        </>);
    }
}

export default Start;
