import { h, Component } from 'preact';
import util from 'preact-util';
import { observer } from 'mobx-preact';
import { Text, Localizer } from 'preact-i18n';
import Markdown from 'preact-markdown';

import Webcams from '../components/webcams/';
import DirekteSport from '../components/direkteSport/';
import DirekteSportView from '../components/direkteSport/view';
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
import QPawsButton from '../components/button/qpaws';

function scrollTo(element, top = 0, left = 0) {
    // element.scrollTop = to;
    element.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "start",
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
        appState.setMainViewCallback(this.scrollToMainContainer);
        const { page, artid, showWebcam = true } = props;
        // if (showWebcam && showWebcam !== 'false') {
        //     appState.setMainView(page || 'webcam');
        // } else {
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
            artid,
            bib,
            showHeader = true,
            showBreadcrumb = true,
            showStatusbar = true,
            showTopViewer = true,
            showProgram = true,
            showWebcam = true,
            showWebtv = true,
            showDirektesport = true,
            showPhoto = true,
            showResults = true,
            showTracking = true,
            showQpawsButton = false,
            showRaceTimer = true,
        } = this.props;
        const { sessionid, showMenu, raceTime } = this.state;
        const { appState } = this.props.stores;
        const { mainView, currentEmail, isAdmin, isExpert, isDevelopment } = appState;
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
                        background-color: rgb(29, 138, 146);
                    }
                    .bg-live-light {
                        background-color: rgb(87, 190, 199);
                    }
                    .text-live-dark {
                        color: rgb(55, 75, 80);
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
            <div class='container-fluid mb-5'>
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
                                class='position-absolute p-3 rounded-lg'
                                style='
                                    height: 200px;
                                    width: 250px;
                                    right: 0;
                                    bottom: -165px;
                                    z-index: 10001;
                                    background-color: rgb(35, 139, 147);
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
                            class='col-12  d-flex justify-content-end'
                            style={`
                                background-color: rgb(172, 219, 226);
                            `}
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
                        class='col-12'
                        style={`
                            background-color: rgb(35, 139, 147);
                            color: rgb(172, 219, 226);
                        `}
                    >
                        {/* <div class='d-flex justify-content-center display-4 w-100 py-3' >
                            Femundløpet Live 2023
                        </div> */}
                        <div class='d-flex justify-content-between'>
                            <Status stores={this.props.stores} {...this.props} />
                        </div>
                    </div>}

                    {showProgram && showProgram !== 'false' && <div
                        class='col-12 '
                        style={`
                            background-color: rgb(55, 75, 80);
                            border-bottom: rgb(92, 109, 112) 1px solid;
                            color: rgb(55, 75, 80);
                        `}
                    >
                        <Program stores={this.props.stores} {...this.props} />
                    </div>}


                    {showTopViewer && showTopViewer !== 'false' && <>
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
                                    {mainView === 'direktesport' && <DirekteSportView stores={this.props.stores} {...this.props} />}
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
                                    {showDirektesport && showDirektesport !== 'false' && <DirekteSport stores={this.props.stores} mainView={mainView} {...this.props} />}
                                    {showPhoto && showPhoto !== 'false' && <Photo stores={this.props.stores} mainView={mainView} {...this.props} />}
                                    {showResults && showResults !== 'false' && <Results stores={this.props.stores} mainView={mainView} {...this.props} />}
                                    {showTracking && showTracking !== 'false' && <Tracking stores={this.props.stores} mainView={mainView} {...this.props} />}
                                    {/* {showButton1 && showButton1 !== 'false' && <Button stores={this.props.stores} {...this.props} />} */}
                                    {showQpawsButton && showQpawsButton !== 'false' && <QPawsButton stores={this.props.stores} {...this.props} />}
                                </div>
                            </div>
                        </div>
                    </>}

                    <div class='col-12  d-flex justify-content-center px-0 py-1 bg-live-dark'>
                        <AdCenter stores={this.props.stores} {...this.props} />
                    </div>

                    <div
                        class='col-12 mt-0 px-3 pb-3 pt-3 bg-live-dark text-live-light'
                    >
                        <div class='row'>
                            <div
                                class='col-12 col-md-6 mb-2 p-1'
                            >
                                <div class='w-100 p-2 rounded-lg'
                                    style='
                                        background-color: #ffffff;
                                        color: #000000;
                                    '
                                >
                                    <Live stores={this.props.stores} {...this.props} />
                                </div>
                            </div>
                            <div
                                class='col-12 col-md-6 mb-2 p-1'
                            >
                                <div class='w-100 p-2 rounded-lg'
                                    style='
                                        background-color: #ffffff;
                                        color: #000000;
                                    '
                                >
                                    <QuestionsAnswers stores={this.props.stores} {...this.props} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class='col-12  d-flex justify-content-center py-3'>
                        <AdBottom stores={this.props.stores} {...this.props} />
                    </div>
                </div>
            </div>
        </>);
    }
}

export default Start;
