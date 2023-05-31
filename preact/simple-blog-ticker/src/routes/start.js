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
            m: Math.floor((difference / 1000 / 60) % 60),
            s: Math.floor((difference / 1000) % 60),
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

    loadAll = (props = this.props) => {
        const { appState } = this.props.stores;
        // appState.setMainViewCallback(this.scrollToMainContainer);
        const { page, artid, showWebcam = true } = props;
        // if (showWebcam && showWebcam !== 'false') {
        //     appState.setMainView(page || 'webcam');
        // } else {
        const { mainView } = appState;
        if (mainView !== page) {
            appState.setSubView(null);
        }
        appState.setMainView(page || 'webtv');
        // }
    }

    tickTimer = () => {
        const { raceDate } = this.props;
        if (!raceDate) {
            return null;
        }        
        const timeLeft = calculateTimeLeft({ countdownto: raceDate });
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

    componentDidMount() {
        this.loadAll();
        this.tickTimer();

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
        } = this.props;
        const { raceTime, timerComponents } = this.state;
        const { appState } = this.props.stores;
        const { mainView, subView, currentEmail, isAdmin, isExpert, isDevelopment, path } = appState;
        return (<>
            <div 
                class='d-flex flex-row flex-nowrap position-relative w-100'
                style={`
                    height: 60px;
                    font-size: 15px;
                `}
            >
                {tickerTitle && <div 
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
                    {tickerTitleUrl ? <>
                        <a href={tickerTitleUrl} class='text-dark' native>
                            {tickerTitle}                    
                        </a>
                    </> : <>
                        {tickerTitle}                
                    </>}
                </div>}

                {raceDate && <div 
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
                        {util.formatDate(raceDate)}
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
                    <Live stores={this.props.stores} {...this.props} />
                </div>
                 
            </div>
        </>);
    }
}

export default Start;
