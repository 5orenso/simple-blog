import { h, Component } from 'preact';
import util from 'preact-util';
import { observer } from 'mobx-preact';
import { Text, Localizer } from 'preact-i18n';
import Markdown from 'preact-markdown';

import Webcams from '../components/webcams/';
import DirekteSport from '../components/direkteSport/';
import DirekteSportView from '../components/direkteSport/view';
import Status from '../components/status/';
import Webcam from '../components/webcam/';
import Results from '../components/results/';
import ResultsView from '../components/results/view';
import Tracking from '../components/tracking/';
import TrackingView from '../components/tracking/view';
import Program from '../components/program/';
import Live from '../components/live/';
import QuestionsAnswers from '../components/questionsAnswers/';
import AdTop from '../components/ads/top';
import AdCenter from '../components/ads/center';
import AdBottom from '../components/ads/bottom';

@observer
class Start extends Component {
  	constructor(props) {
        super(props);
        this.state = {
            sessionid: new Date().getTime(),
        };
    }

    compenentDidMount() {
        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "visible") {
                // page is visible
            } else {
                // page is hidden
            }
        });
    }

    render() {
        const { sessionid } = this.state;
        const { appState } = this.props.stores;
        const { mainView, currentEmail, isAdmin, isExpert, isDevelopment } = appState;
        return (<>
            <div class='container-fluid mb-5'>
                <div class='row'>
                    <div
                        class='col-12 d-flex justify-content-between py-3'
                        style={`
                            background-color: rgb(172, 219, 226);
                        `}
                    >
                        <div class='w-25 d-flex align-items-center justify-content-start'>&nbsp;</div>

                        <div class='w-50 d-flex align-items-center'>
                            <img src={`${isDevelopment ? '' : '/preact/simple-blog-livecenter'}/assets/images/logo.png`} alt='logo' class='img-fluid' />
                        </div>

                        <div class='w-25 d-flex align-items-center justify-content-end'>&nbsp;</div>
                    </div>

                    <div class='col-12  d-flex justify-content-end'>
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
                    </div>

                    <div class='col-12  d-flex justify-content-center py-1'>
                        <AdTop stores={this.props.stores} {...this.props} />
                    </div>

                    <div
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
                    </div>

                    <div
                        class='col-12 '
                        style={`
                            background-color: rgb(55, 75, 80);
                            border-bottom: rgb(92, 109, 112) 1px solid;
                            color: rgb(55, 75, 80);
                        `}
                    >
                        <Program stores={this.props.stores} {...this.props} />
                    </div>


                    <div
                        class='col-12 '
                        style={`
                            background-color: rgb(55, 75, 80);
                            color: #ffffff;
                        `}
                    >
                        <div class='row'>
                            <div class='col-12 col-lg-9 py-2'>
                                {mainView === 'direktesport' && <DirekteSportView stores={this.props.stores} {...this.props} />}
                                {mainView === 'results' && <ResultsView stores={this.props.stores} {...this.props} />}
                                {mainView === 'tracking' && <TrackingView stores={this.props.stores} {...this.props} />}

                                {(!mainView || mainView === 'webcam') && <Webcam stores={this.props.stores} {...this.props} />}
                            </div>
                            <div class='col-12 col-lg-3 d-flex flex-column align-items-center justify-content-center'>
                                <Webcams stores={this.props.stores} mainView={mainView} {...this.props} />
                                <DirekteSport stores={this.props.stores} mainView={mainView} {...this.props} />
                                <Results stores={this.props.stores} mainView={mainView} {...this.props} />
                                <Tracking stores={this.props.stores} mainView={mainView} {...this.props} />
                            </div>
                        </div>
                    </div>

                    <div class='col-12  d-flex justify-content-center py-1'>
                        <AdCenter stores={this.props.stores} {...this.props} />
                    </div>

                    <div
                        class='col-12 mt-1 px-4 pb-3'
                        style={`
                            background-color: rgb(35, 139, 147);
                            color: rgb(172, 219, 226);
                        `}
                    >
                        <div class='row'>
                            <div class='col-12 d-flex justify-content-center display-4' >
                                Femundløpet Livesenter
                            </div>
                        </div>
                        <div class='row'>
                            <div class='col-12 col-lg-6 py-3' style='background-color: #ffffff; color: #000000;'>
                                <Live stores={this.props.stores} {...this.props} />
                            </div>
                            <div class='col-12 col-lg-6 py-3' style='background-color: #ffffff; color: #000000;'>
                                <QuestionsAnswers stores={this.props.stores} {...this.props} />
                            </div>
                        </div>
                    </div>

                    <div class='col-12  d-flex justify-content-center py-1'>
                        <AdBottom stores={this.props.stores} {...this.props} />
                    </div>
                </div>
            </div>
        </>);
    }
}

export default Start;
