import { h, Component } from 'preact';

import { Router, route } from 'preact-router';
import { createHashHistory } from 'history';
import { observer } from 'mobx-preact';
import { IntlProvider, Text, Localizer } from 'preact-i18n';
import linkState from 'linkstate';
import AsyncRoute from 'preact-async-route';

import util from 'preact-util';

const W3CWebSocket = require('websocket').w3cwebsocket;

const history = createHashHistory();

import Start from './routes/start';

import appState from './stores/appstate';
import articleStore from './stores/article';

import definitionNo from './languages/no.json';
import definitionEn from './languages/en.json';

import LoadingSpinner from './components/loadingSpinner/';

const countryMap = {
    no: definitionNo,
    en: definitionEn,
    default: definitionEn,
};

class Catcher extends Component {
    constructor() {
        super();
        this.state = {
            errored: false,
            errorsReported: 0,
        };
    }

    componentDidCatch(error) {
        const { errorsReported } = this.state;
        if (errorsReported < 10) {
            const data = {
                timestamp: Math.floor(new Date().getTime() / 1000),
                error: {
                    name: error.name,
                    message: error.message,
                    stack: error.stack,
                },
                location: window.location,
            };
            this.setState({ errored: true, errorsReported: errorsReported + 1 });
            util.fetchApi('/api/errors/', { method: 'POST' }, data);
        }
    }

    reload = (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.location.assign('/');
        // window.location.reload();
    }

    render(props, state) {
        if (state.errored) {
            return (
                <div class='container-fluid h-100'>
                    <div class='row h-100'>
                        <div class='col-12 text-center my-auto'>
                            <div class='display-1 text-muted'>
                                <i class='fas fa-bomb' />
                            </div>
                            <h5>Something went badly wrong...</h5>
                            <p>Error is reported automatically.</p>
                            <a class='mt-3 btn btn-lg btn-primary' href='#' onClick={this.reload}>Go to the frontpage</a>
                        </div>
                    </div>
                </div>
            );
        }
        return props.children;
    }
}

@observer
class App extends Component {
	constructor(props) {
        super(props);
		this.stores = {
            appState,
            articleStore,
        };
        const startUrl = window.location.hash.replace(/^#/, '');
        this.state = {
            jwtToken: props.jwtToken || util.getJwtToken(),
            refreshTime: new Date().getTime(),
            currentUrl: startUrl,
            checkCordovaCounter: 0,
            bug: {},
            appLoaded: false,
        };

        const { darkmode } = appState;
        util.toggleDarkModeClasses(darkmode);
    }

    /** Gets fired when the route changes.
	 *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
	 *	@param {string} event.url	The newly routed URL
	 */
	handleRoute = e => {
        const { scrolledDown } = this.state;
        const { prevScroll } = appState;
		this.setState({ currentUrl: e.url });
        appState.setPrevPath(e.previous);
        appState.setPrevScroll(scrolledDown);
        appState.setPath(e.url);
        this.cleanupMemory(e.url, e.previous);
        const { router } = e;
        const { props = {} } = router;
        const { history = {} } = props;
        const { action = {} } = history;
        if (this.appContainer) {
            //             if (prevScroll && action === 'POP') {
            //                 console.log({ e, scrolledDown, prevScroll }, this.appContainer);
            //                 this.scrollTimer = setTimeout(() => this.appContainer.scrollTo({ top: prevScroll }), 2000);
            //             }
            if (!e.url.match(/skipScroll/)) {
                // this.appContainer.scrollTo({ top: 0 });
                // mu.scrollTo(this.appContainer);
            }
        }
	}

    cleanupMemory = (currentUrl, prevUrl) => {
        try {
            const urlRegexpWorkout = new RegExp(`^/workouts`);
            if (urlRegexpWorkout.test(prevUrl) && !urlRegexpWorkout.test(currentUrl)) {
                // workoutStore.cleanupMemory();
            }
        } catch (err) {
            console.log(err);
        }
    }

    setAppLoaded = (loaded) => {
        this.setState({
            appLoaded: loaded,
        });
    }

    async loadAll() {
        this.setAppLoaded(false);
        const { jwtToken } = this.state;
        appState.updateField('jwtToken', jwtToken);
        util.setJwtToken(jwtToken);
        await appState.getInfo();

        const { darkmode } = appState;
        // await userStore.getInfo(false, true, false, 'en', darkmode ? 1 : 0);
        // const { isAdmin, isRaceAdmin, isVeterinary, user } = userStore;

        // Determin version of app
        const hostname = window.location.host;
        // const storedLocation = user.settings?.locationBeta ? 'beta' : 'prod';
        let appVersion;
        switch (hostname) {
            case 'themusher.app':
                appVersion = 'prod';
                break;
            case 'dev.themusher.app':
                appVersion = 'beta';
                break;
            case '127.0.0.1:8080':
            case 'localhost:8080':
                appVersion = 'dev';
                break;
            default:
                appVersion = 'prod';
        }

        this.setAppLoaded(true);

        // this.websocket({
        //     id: 1000,
        //     firstname: 'anonymous',
        //     lastname: 'anonymous',
        // });

        // console.log({ appVersion });
        // if (appVersion === 'prod' && storedLocation === 'beta') {
        //     const location = 'https://dev.themusher.app';
        //     window.location = location;
        // }
    }

    touchStart = (e) => {
        this.setState({
            startX: e.touches[0].clientX,
            startY: e.touches[0].clientY,
        })
    }

    touchEnd = (e) => {
        this.setState({
            startY: undefined,
            startX: undefined,
            readyToRefresh: false,
        });

        const {
            swipeRight = () => {},
            swipeLeft = () => {},
            swipeUp = () => {},
            swipeDown = () => {},
            swipeRightIndicate = () => {},
            swipeLeftIndicate = () => {},
            swipeUpIndicate = () => {},
            swipeDownIndicate = () => {},
        } = appState;

        swipeRightIndicate(e, { startY: 0, startX: 0, xUp: 0, yUp: 0, xDiff: 0, yDiff: 0, absXDiff: 0, absYDiff: 0 });
        swipeLeftIndicate(e, { startY: 0, startX: 0, xUp: 0, yUp: 0, xDiff: 0, yDiff: 0, absXDiff: 0, absYDiff: 0 });
        swipeUpIndicate(e, { startY: 0, startX: 0, xUp: 0, yUp: 0, xDiff: 0, yDiff: 0, absXDiff: 0, absYDiff: 0 });
        swipeDownIndicate(e, { startY: 0, startX: 0, xUp: 0, yUp: 0, xDiff: 0, yDiff: 0, absXDiff: 0, absYDiff: 0 });
    }

    touchMove = (e) => {
        const { startY, startX, refreshing } = this.state;
        const {
            swipeRight = () => {},
            swipeLeft = () => {},
            swipeUp = () => {},
            swipeDown = () => {},
            swipeRightIndicate = () => {},
            swipeLeftIndicate = () => {},
            swipeUpIndicate = () => {},
            swipeDownIndicate = () => {},
        } = appState;
        const refreshRange = 130;
        const readyToRefreshRange = 30;
        const actionRange = 200;
        const indicateActionRange = 30;

        const xUp = e.touches[0].clientX;
        const yUp = e.touches[0].clientY;

        const xDiff = startX - xUp;
        const yDiff = startY - yUp;
        const absXDiff = Math.abs(xDiff);
        const absYDiff = Math.abs(yDiff);

        if ( absXDiff > absYDiff ) { /*most significant*/
            if ( xDiff > 0 ) {
                /* left swipe */
                // console.log('left swipe', { startY, startX, xDiff, swipeLeft });
                if (absXDiff > actionRange) {
                    swipeLeft(e, { startY, startX, xUp, yUp, xDiff, yDiff, absXDiff, absYDiff });
                }
                if (absXDiff > indicateActionRange) {
                    swipeLeftIndicate(e, { startY, startX, xUp, yUp, xDiff, yDiff, absXDiff, absYDiff });
                }
            } else {
                /* right swipe */
                // console.log('right swipe', { e, startY, startX, xDiff, swipeRight });
                // eslint-disable-next-line no-lonely-if
                if (absXDiff > actionRange) {
                    swipeRight(e, { startY, startX, xUp, yUp, xDiff, yDiff, absXDiff, absYDiff });
                }
                if (absXDiff > indicateActionRange) {
                    swipeRightIndicate(e, { startY, startX, xUp, yUp, xDiff, yDiff, absXDiff, absYDiff });
                }
            }
        } else if ( yDiff > 0 ) {
            /* up swipe */
            // console.log('up swipe', { startY, startX, yDiff });
            if (absYDiff > actionRange) {
                swipeUp(e, { startY, startX, xUp, yUp, xDiff, yDiff, absXDiff, absYDiff });
            }
            if (absXDiff > indicateActionRange) {
                swipeUpIndicate(e, { startY, startX, xUp, yUp, xDiff, yDiff, absXDiff, absYDiff });
            }
        } else {
            /* down swipe */
            // console.log('down swipe', { startY, startX, yDiff });
            if (absYDiff > actionRange) {
                swipeDown(e, { startY, startX, xUp, yUp, xDiff, yDiff, absXDiff, absYDiff });
            }
            if (absXDiff > indicateActionRange) {
                swipeDownIndicate(e, { startY, startX, xUp, yUp, xDiff, yDiff, absXDiff, absYDiff });
            }
            const skipRefresh = e.target.closest('.skipRefresh');
            if (!skipRefresh) {
                const { scrollTop } = this.appContainer;
                if (scrollTop === 0 && absYDiff > refreshRange && !refreshing) {
                    this.setState({
                        refreshing: true,
                        readyToRefresh: false,
                    });
                    this.pullToRefreshPage();
                } else if (scrollTop === 0 && absYDiff > readyToRefreshRange && !refreshing) {
                    this.setState({ readyToRefresh: true });
                }
            }
        }
    }

    scrollToTop = () => {
        if (this.appContainer) {
            mu.scrollTo(this.appContainer);
            this.refreshPage();
            // this.appContainer.scrollTo({
            //     top: 0,
            //     left: 0,
            //     behavior: 'smooth',
            // });
        }
    }

    showReportBug = () => {
        const { showBugReport } = this.state;
        this.setState({
            showBugReport: !showBugReport,
        });
    }

    reportBug = async () => {
        const { bug = {} } = this.state;
        if (!bug.text) {
            this.setState({
                showBugReport: false,
            });
            return '';
        }
        const { currentUrl, path } = this.state;
        // const { user } = userStore;
        const { language: localLanguage = 'en', isCordova } = appState;
        // const { language = localLanguage } = user;
        // const { cordovaActiveTrackingParams, cordovaAuthorizationStatus, powerSaveStatus,
		// 	providerState, log, isRunning, totalDistance, geoLocationState, bgGeo, currentSpeed, totalTime, workouts } = workoutStore;

        // const currentTeamObject = userStore.getCurrentTeam();
        // const currentTeam = currentTeamObject ? currentTeamObject.id : undefined;

        await appState.sendEmailPlain({
            to: 'post@themusher.no',
            from: user.email,
            subject: `Bugreport: ${currentUrl}`,
            body: `Bugreport!

${bug.text.replace(/\n/g, '<br />\n')}

<hr />
DEBUG INFO:
<hr />

<xmp>
currentUrl: ${currentUrl}<br />
currentTeam: ${currentTeam}<br />
path: ${path}<br />
localLanguage: ${localLanguage}<br />
isCordova: ${isCordova}<br />
language: ${language}<br />
</xmp>
<hr />

            `,
        });
        this.setState({
            showBugReport: false,
            bug: {
                text: '',
            },
        });
    }

    doneRefreshing() {
        clearTimeout(this.refreshTimer);
        this.refreshTimer = setTimeout(() => this.setState({
            startY: undefined,
            refreshing: false,
            readyToRefresh: false,
        }), 1000);

    }

    setRefreshTime = () => {
        const refreshTime= new Date().getTime();
        this.setState({ refreshTime });
    }

    pullToRefreshPage = () => {
        const { currentUrl } = this.state;
        const urlRegexpInboxDetail = new RegExp(`^/inbox/[a-z0-9-]+`);

        if (urlRegexpInboxDetail.test(currentUrl)) {
            messageStore.loadMore();
        } else {
            this.refreshPage();
        }
        return this.doneRefreshing();
    }

    refreshPage = () => {
        const { currentUrl } = this.state;
        try {
            const urlRegexpStory = new RegExp(`^/$`);
            const urlRegexpWorkoutTracking = new RegExp(`^/workouts/tracking`);
            if (urlRegexpWorkoutTracking.test(currentUrl)) {
                // do nothing
            } else if (urlRegexpStory.test(currentUrl)) {
                this.setRefreshTime(currentUrl);
                return this.doneRefreshing();
            }
            // PubSub.publish(topics.REFRESH_PAGE, {
            //     message: 'Refresh page.',
            // });
        } catch (err) {
            console.log(err);
        }
    }

    onScroll = (e) => {
        const { currentUrl } = this.state;
        // Scroll to top function
        const element = e.target;
        const { scrolledDown } = this.state;
        if (element) {
            if (element.scrollTop > SCROLLDOWN_LIMIT && !scrolledDown) {
            // if (element.scrollTop > SCROLLDOWN_LIMIT) {
                this.setState({
                    scrolledDown: element.scrollTop,
                });
            } else if (element.scrollTop === 0) {
                this.setState({
                    scrolledDown: 0,
                });
            }
        }

        // Load more content function
        const { isAtBottom } = this.state;
        const marginToBottom = element.clientHeight;
        if (element.scrollTop + element.clientHeight + marginToBottom >= element.scrollHeight) {
            if (!isAtBottom) {
                this.setState({ isAtBottom: true });
                // console.log({ currentUrl });
                const regex1 = /^\/$/;

                switch (true) {
                    case regex1.test(currentUrl):
                        return this.loadMoreStories();
                }
            }
        } else if (isAtBottom) {
            this.setState({ isAtBottom: false });
        }

        // console.log({ scrollTop: element.scrollTop, clientHeight: element.clientHeight, scrollHeight: element.scrollHeight });
    }

    loadMoreStories = async () => {
		// await storyStore.loadMore();
    }

    checkShareApi = () => {
        appState.checkShareApi();
    }

    websocket(user) {
        const { webocketUrl } = appState;
        const client = new W3CWebSocket(webocketUrl, 'echo-protocol');

        client.onerror = function(err) {
            console.log('Connection Error', err);
        };

        client.onopen = function() {
            console.log('WebSocket Client Connected');
            client.send(JSON.stringify({
                userId: user.id,
                userName: `${user.firstname} ${user.lastname}`,
                type: 'auth',
            }));
            // function sendNumber() {
            //     if (client.readyState === client.OPEN) {
            //         var number = Math.round(Math.random() * 0xFFFFFF);
            //         client.send(number.toString());
            //         setTimeout(sendNumber, 1000);
            //     }
            // }
            // sendNumber();
        };

        client.onclose = function() {
            console.log('echo-protocol Client Closed');
        };

        client.onmessage = function(e) {
            if (typeof e.data === 'string') {
                console.log("Received: '" + e.data + "'");
            }
        };
    }

    componentWillMount() {
        // window.addEventListener("cordovacallbackerror", (event) => {
        //     // event.error contains the original error object
        //     console.log(event.error);
        // });
        const inputProps = util.collectPropsFromElement(window.document.body);
        const apiServer = inputProps.apiServer || this.props.apiServer || `${window.location.protocol}//${window.location.host}`;
        util.setApiServer(apiServer);

        const websocketUrl = inputProps.websocketUrl || this.props.websocketUrl || `wss://${window.location.host}:1337`;
        appState.setWebsocketServer(websocketUrl);

        // this.ensureCordova();
        this.checkShareApi();
        this.loadAll();
    }

    componentDidMount() {
        // document.addEventListener('pause', this.onPause, false);
        // document.addEventListener('resume', this.onResume, false);
        // document.addEventListener('menubutton', this.onMenubutton, false);
        // document.addEventListener('backbutton', this.onBackbutton, false);
        // document.addEventListener('searchbutton', this.onSearchbutton, false);
        appState.setAppContainer(this.appContainer);
        const { currentUrl } = this.state;
        appState.setPath(currentUrl);

    }

    render() {
        const { refreshing, jwtToken, readyToRefresh, currentUrl, refreshTime, scrolledDown, showBugReport, bug = {}, appLoaded } = this.state;
        const scrolledDownPlaceholder = false;
        const { path } = this.props;
        const { language = 'en', isCordova, showDrawer } = appState;
        const languageDef = countryMap[language || 'default'];

        if (appLoaded) {
            return (
                <IntlProvider definition={languageDef}>
                    <Catcher>
                        <div id='app'
                            style={`overflow-x: auto; overflow-y: ${showDrawer ? 'hidden': 'auto'}; height: 100%; ${readyToRefresh ? 'padding-top: 50px;' : ''} ${refreshing ? 'padding-top: 70px;' : ''} transition: .3s; overscroll-behavior: contain;`}
                            onTouchstart={this.touchStart}
                            onTouchend={this.touchEnd}
                            onTouchmove={this.touchMove}
                            onScroll={this.onScroll}
                            ref={c => this.appContainer = c}
                        >
                            <Router onChange={this.handleRoute} history={history}>
                                {/* <AsyncRoute stores={this.stores} {...this.props} scrolledDown={scrolledDownPlaceholder} default getComponent={() => import('./routes/start').then(module => module.default)} /> */}
                                <Start stores={this.stores} scrolledDown={scrolledDownPlaceholder} {...this.props} path="/:page/:artid/:bib" />
                                <Start stores={this.stores} scrolledDown={scrolledDownPlaceholder} {...this.props} path="/:page/:artid" />
                                <Start stores={this.stores} scrolledDown={scrolledDownPlaceholder} {...this.props} path="/:page" />
                                <Start stores={this.stores} scrolledDown={scrolledDownPlaceholder} {...this.props} default />

                                <LoadingSpinner default goto='/' gotoTitle='Home' routerName='livecenter' />
                            </Router>
                        </div>
                    </Catcher>
                </IntlProvider>
            );
        } else {
            return (
                <div id='app'>
                    <LoadingSpinner />
                </div>
            );
        }

    }
}

export default App;

