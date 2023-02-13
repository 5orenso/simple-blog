import { h, Component } from 'preact';
import util from 'preact-util';
import { observer } from 'mobx-preact';
import { Text, Localizer } from 'preact-i18n';
import Markdown from 'preact-markdown';

import Webcams from '../components/webcams/';
import WebTv from '../components/webtv/';
import WebTvView from '../components/webtv/view';
import Status from '../components/status/';
import Webcam from '../components/webcam/';
import Results from '../components/results/';
import ResultsView from '../components/results/view';
import Photo from '../components/photo/';
import PhotoView from '../components/photo/view';
import Tracking from '../components/tracking/';
import TrackingView from '../components/tracking/view';
import Program from '../components/program/';
import Live from '../components/live/';
import QuestionsAnswers from '../components/questionsAnswers/';
import AdTop from '../components/ads/top';
import AdCenter from '../components/ads/center';
import AdBottom from '../components/ads/bottom';

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
        const { raceTimerStart } = this.props;
        if (!raceTimerStart) {
            return null;
        }
        const now = new Date().getTime();
        const raceStart = new Date(raceTimerStart).getTime();
        const diff = Math.floor((now - raceStart) / 1000);

        if (diff < 0) {
            this.setState({
                raceTime: 0,
            });
        } else {
            this.setState({
                raceTime: diff,
            });
        }

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
            page,
            artid,
            bib,
            showHeader = true,
            showBreadcrumb = true,
            showStatusbar = true,
            showAdCenter = true,
            showAdBottom = true,
            showProgram = true,
            showWebcam = true,
            showWebtv = true,
            showDirektesport = true,
            showPhoto = true,
            showQa = true,
            showResults = true,
            showTracking = true,
            showRaceTimer = true,
        } = this.props;
        const { sessionid, showMenu, raceTime } = this.state;
        const { appState } = this.props.stores;
        const { mainView, subView, currentEmail, isAdmin, isExpert, isDevelopment, path } = appState;
        return (<>
            <style>
                {`
                    .fullScreen {
                        width: 100vw;
                        height: 100vh;
                        position: fixed;
                        top: 0;
                        left: 0;
                        z-index: 9999;
                    }
                    .bg-live-dark {
                        background-color: rgb(15, 120, 252);
                    }
                    .bg-live-light {
                        background-color: #efefef;
                    }
                    .text-live-dark {
                        color: rgb(80, 80, 80);
                    }
                    .text-live-light {
                        color: rgb(255, 255, 255);
                    }

                    .qa a:link, .qa a:visited {
                        color: #fff;
                        text-decoration: underline;
                    }
                `}
            </style>
            {/* <xmp>{JSON.stringify(this.props, null, 2)}</xmp> */}
            <div class='container-fluid mb-5 px-0'>
                <div class='row'>
                    {showHeader && showHeader !== 'false' && <div
                        class='col-12 d-flex justify-content-between pt-2 px-0'
                        style={`
                            background-color: rgb(172, 219, 226);
                        `}
                    >
                        <div class='w-25 d-flex flex-column align-items-center justify-content-center text-live-dark' style='line-height: 1.0em;'>
                            {/* <small class='d-none d-sm-inline-block'> */}
                            {showRaceTimer && showRaceTimer !== 'false' ? <>
                                <small>
                                    <small>RaceTime:</small><br />
                                </small>
                                <span style='font-size: 1.2em;'>{util.secToHms(raceTime)}</span>
                            </> : <>
                                &nbsp;
                            </>}
                        </div>

                        <div class='w-50 d-flex justify-content-center align-items-center'>
                            <a href='/'><img src={`${isDevelopment ? '' : '/preact/simple-blog-livecenter'}/assets/images/logo.png`} alt='logo' class='img-fluid' style='max-height: 100px;' /></a>
                        </div>

                        <div class='w-25 d-flex align-items-center justify-content-end position-relative pr-2'>
                            <i class='fas fa-bars' style='font-size: 3.0em;' onClick={this.toggleMenu} />

                            {showMenu && <div
                                class='position-absolute p-3 rounded-lg bg-live-dark'
                                style='
                                    height: 200px;
                                    width: 250px;
                                    right: 0;
                                    bottom: -165px;
                                    z-index: 10001;
                                    color: #ffffff;
                                '>
                                <a href='https://www.femundlopet.no/v2/' class='btn btn-block btn-link text-left text-white'>Femundlopet.no</a>
                                <a href='https://www.femundlopet.no/v2/for-utovere/pameldte/50' class='btn btn-block btn-link text-left text-white'>Deltakere</a>
                                <a href='https://femundlopet.no/v2/for-utovere/program-/32' class='btn btn-block btn-link text-left text-white'>Program</a>
                            </div>}
                        </div>
                    </div>}

                    {showBreadcrumb && showBreadcrumb !== 'false' && <>
                        {(isAdmin || isExpert) && <div
                            class='col-12  d-flex justify-content-end bg-live-dark'
                        >
                            <div class='d-flex justify-content-end align-items-end'>
                                <small>
                                    <span class='badge badge-pill badge-success'>
                                        {currentEmail && <>Logged in as {currentEmail}</>}
                                    </span>
                                    <span class='badge badge-pill badge-danger ml-2'>
                                        {isAdmin && <>Admin</>}
                                    </span>
                                    <span class='badge badge-pill badge-warning ml-2'>
                                        {isExpert && <>Expert</>}
                                    </span>
                                </small>
                            </div>
                        </div>}
                    </>}

                    {/* <div class='col-12  d-flex justify-content-center py-1'>
                        <AdTop stores={this.props.stores} {...this.props} />
                    </div> */}

                    {showStatusbar && showStatusbar !== 'false' && <div
                        class='col-12 bg-info text-live-light mb-2'
                    >
                        {/* <div class='d-flex justify-content-center display-4 w-100 py-3' >
                            Femundløpet Live 2023
                        </div> */}
                        <div class='d-flex justify-content-between'>
                            <Status stores={this.props.stores} {...this.props} />
                        </div>
                    </div>}

                    {/* {showProgram && showProgram !== 'false' && <div
                        class='col-12 bg-live-dark border-bottom'
                    >
                        <Program stores={this.props.stores} {...this.props} />
                    </div>} */}


                    {/* {showTopViewer && showTopViewer !== 'false' && <>
                        <div
                            class='col-12 '
                            style={`
                                background-color: rgb(55, 75, 80);
                                color: #ffffff;
                            `}
                        >
                            <div class='row'>
                                <div
                                    class='col-12 col-lg-12 py-0'
                                    ref={c => this.mainContainer = c}
                                >
                                    {mainView === 'webcam' && <Webcam stores={this.props.stores} {...this.props} />}
                                    {mainView === 'webtv' && <WebTvView stores={this.props.stores} {...this.props} />}
                                    {mainView === 'photo' && <PhotoView stores={this.props.stores} {...this.props} />}
                                    {mainView === 'results' && <ResultsView stores={this.props.stores} {...this.props} />}
                                    {mainView === 'tracking' && <TrackingView stores={this.props.stores} {...this.props} />}
                                </div>

                            </div>
                        </div>

                        <div class='col-12'>
                            <div class='row'>
                                <div class='col-12 col-lg-12 d-flex flex-wrap flex-row align-items-center justify-content-center pt-2 pb-2'>
                                    {showWebcam && showWebcam !== 'false' && <Webcams stores={this.props.stores} mainView={mainView} {...this.props} />}
                                    {showWebtv && showWebtv !== 'false' && <WebTv stores={this.props.stores} mainView={mainView} {...this.props} />}
                                    {showPhoto && showPhoto !== 'false' && <Photo stores={this.props.stores} mainView={mainView} {...this.props} />}
                                    {showResults && showResults !== 'false' && <Results stores={this.props.stores} mainView={mainView} {...this.props} />}
                                    {showTracking && showTracking !== 'false' && <Tracking stores={this.props.stores} mainView={mainView} {...this.props} />}
                                </div>
                            </div>
                        </div>
                    </>} */}

                    {showAdCenter && showAdCenter !== 'false' && <div class='col-12  d-flex justify-content-center px-0 py-1 bg-live-dark'>
                        <AdCenter stores={this.props.stores} {...this.props} />
                    </div>}

                    <div class='col-12 mt-0'>
                        <div class='row'>
                            <div class='col-12'>
                                {(subView === 'webtv') && <>
                                    <WebTvView stores={this.props.stores} {...this.props} showList={false} />
                                </>}
                                {(subView === 'webcam') && <>
                                    <Webcam stores={this.props.stores} {...this.props} showList={false} />
                                </>}
                                {(subView === 'photo') && <>
                                    <PhotoView stores={this.props.stores} {...this.props} showList={false} />
                                </>}
                                {(subView === 'tracking') && <>
                                    <TrackingView stores={this.props.stores} {...this.props} showList={false} />
                                </>}
                                {(subView === 'results') && <>
                                    <ResultsView stores={this.props.stores} {...this.props} showList={false} />
                                </>}
                            </div>
                            <div class='col-12 col-lg-7'>
                                <div class='w-100 p-2 rounded-lg'>
                                    <Live stores={this.props.stores} {...this.props} />
                                </div>
                            </div>

                            <div
                                class='col-12 col-lg-5 bg-light border-left'
                                ref={c => this.mainContainer = c}
                            >
                                <div class='w-100'>
                                    <ul class='nav nav-pills nav-fill'>
                                        {showWebtv && showWebtv !== 'false' && <li class='nav-item'>
                                            <a class={`nav-link ${mainView === 'webtv' ? 'active' : ''}`} href='/webtv'><i class='fas fa-tv-retro' /> WebTv</a>
                                        </li>}
                                        {showWebcam && showWebcam !== 'false' && <li class='nav-item'>
                                            <a class={`nav-link ${mainView === 'webcam' ? 'active' : ''}`} href='/webcam'><i class='fa-solid fa-camera-cctv' /> Webcam</a>
                                        </li>}
                                        {showPhoto && showPhoto !== 'false' && <li class='nav-item'>
                                            <a class={`nav-link ${mainView === 'photo' ? 'active' : ''}`} href='/photo'><i class='fas fa-images' /> Foto</a>
                                        </li>}
                                        {showQa && showQa !== 'false' && <li class='nav-item'>
                                            <a class={`nav-link ${mainView === 'qa' ? 'active' : ''}`} href='/qa'><i class='fas fa-question' /> Spør oss</a>
                                        </li>}
                                        {showProgram && showProgram !== 'false' && <li class='nav-item'>
                                            <a class={`nav-link ${mainView === 'program' ? 'active' : ''}`} href='/program'><i class='fa-solid fa-calendar' /> Program</a>
                                        </li>}
                                        {showTracking && showTracking !== 'false' && <li class='nav-item'>
                                            <a class={`nav-link ${mainView === 'tracking' ? 'active' : ''}`} href='/tracking'><i class='fa-solid fa-map-location-dot' /> Tracking</a>
                                        </li>}
                                        {showResults && showResults !== 'false' && <li class='nav-item'>
                                            <a class={`nav-link ${mainView === 'results' ? 'active' : ''}`} href='/results'><i class='fa-solid fa-list-ol' /> Result</a>
                                        </li>}
                                    </ul>
                                </div>
                                <div class='w-100 p-2 rounded-lg'>
                                    {(mainView === 'webtv' || mainView === 'live') && <>
                                        <WebTvView stores={this.props.stores} {...this.props} />
                                    </>}
                                    {(mainView === 'webcam') && <>
                                        <Webcam stores={this.props.stores} {...this.props} />
                                    </>}
                                    {(mainView === 'photo') && <>
                                        <PhotoView stores={this.props.stores} {...this.props} />
                                    </>}
                                    {(mainView === 'qa') && <>
                                        <QuestionsAnswers stores={this.props.stores} {...this.props} />
                                    </>}
                                    {(mainView === 'program') && <>
                                        <Program stores={this.props.stores} {...this.props} />
                                    </>}
                                    {(mainView === 'tracking') && <>
                                        <TrackingView stores={this.props.stores} {...this.props} />
                                    </>}
                                    {(mainView === 'results') && <>
                                        <ResultsView stores={this.props.stores} {...this.props} />
                                    </>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {showAdBottom && showAdBottom !== 'false' && <div class='col-12  d-flex justify-content-center py-3'>
                        <AdBottom stores={this.props.stores} {...this.props} />
                    </div>}
                </div>
            </div>
        </>);
    }
}

export default Start;
