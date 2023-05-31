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
                {timeLeft[interval]}<span class={`text-muted font-weight-lighter ${isDay ? 'mr-1' : ''}`}>{isDay ? 'd' : (isSec ? '' : ':')}</span>{" "}
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
                    height: 60px;
                    font-size: 15px;
                `}
            >
                {title && <div 
                    class='position-absolute d-flex justify-content-center align-items-center border-right'
                    style={`
                        top: 0; 
                        left: 0; 
                        width: 60px; 
                        height: 60px;
                        box-shadow: 2px 0 5px -2px #888;
                        font-size: 18px;
                    `}
                >
                    {titleUrl ? <>
                        <a href={titleUrl} class='text-dark' native>
                            {title}                    
                        </a>
                    </> : <>
                        {title}                
                    </>}
                </div>}

                {date && <div 
                    class='position-absolute d-flex flex-column justify-content-center align-items-center border-left'
                    style={`
                        top: 0; 
                        right: 0; 
                        width: 140px; 
                        height: 60px;
                        box-shadow: 0px 2px 5px -2px #888;
                    `}
                >
                    <div>
                        {util.formatDate(date)}
                    </div>
                    <small>
                        <div class='d-flex flex-row flex-nowrap'>
                            {timerComponents}
                        </div>
                    </small>
                </div>}

                <div 
                    class='w-100 overflow-hidden d-flex flex-row flex-nowrap' 
                    style='padding-left: 60px; padding-right: 140px;'
                >
                    {articleId ? <>
                        {article.id ? <>
                            <Live stores={this.props.stores} {...this.props} />            
                        </> : <>
                            Loading...
                        </>}
                    </>: <>
                        <Live stores={this.props.stores} {...this.props} />
                    </>}
                </div>
                 
            </div>
        </>);
    }
}

export default Start;
