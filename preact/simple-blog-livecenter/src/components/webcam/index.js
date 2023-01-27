import { h, Component } from 'preact';
import util from 'preact-util';
import { observer } from 'mobx-preact';
import { Text, Localizer } from 'preact-i18n';
import Markdown from 'preact-markdown';

@observer
class Webcam extends Component {
  	constructor(props) {
        super(props);
        this.state = {
        };
    }

    chooseCheckpoint = async e => {
        const { appState } = this.props.stores;
        appState.chooseCheckpoint(e);
        await this.getWeather();
    }

    getWeather = async () => {
        const { appState } = this.props.stores;
        const { currentCheckpoint } = appState;
        await appState.getWeather({
            lat: currentCheckpoint.lat,
            lon: currentCheckpoint.lon,
            altitude: currentCheckpoint.altitude,
        });
    }

    inputCheckpoint = (props) => {
        const { appState } = this.props.stores;
        appState.chooseCheckpoint(null, props.artid);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.page === 'webcam') {
            if (nextProps.artid !== this.props.artid) {
                this.inputCheckpoint(nextProps, false)
            }
        }
    }

    componentDidMount() {
        if (this.props.page === 'webcam') {
            this.inputCheckpoint(this.props, false);
        }
    }

    render() {
        const { sessionid } = this.props;
        const { appState } = this.props.stores;
        const { currentCheckpoint, checkpoint, checkpoints } = appState;
        const { mapColorMode, drawerHeightLarge } = appState;
        return (<>
            {/* <xmp>{JSON.stringify(weather[0], null, 2)}</xmp>
            "instant": {
                "details": {
                    "air_pressure_at_sea_level": 999.1,
                    "air_temperature": -7.6,
                    "cloud_area_fraction": 16.8,
                    "relative_humidity": 54.2,
                    "wind_from_direction": 41.4,
                    "wind_speed": 1.4
                }
            }, */}
            <div class='row'>
                <div class='w-100 d-flex flex-row justify-content-center'>
                    <div class='flex-grow-1 d-flex justify-content-center'>
                        {currentCheckpoint && <>
                            {currentCheckpoint.camera && <>
                                <img src={currentCheckpoint.camera} class='img-fluid' /><br />
                            </>}
                        </>}
                    </div>
                    {/* <div class='d-flex flex-column ml-3'>
                        {checkpoints && checkpoints.map(cp => {
                            return <>
                                <button type='button' class={`btn btn-link p-0 text-left ${checkpoint === cp.id ? 'text-primary' : 'text-dark'}`} data-id={cp.id} onClick={this.chooseCheckpoint}><nobr>{cp.name}</nobr></button>
                            </>;
                        })}
                    </div> */}
                </div>
            </div>
            <div class='row position-relative'>

                <div class='w-100 position-relative mt-3 mb-3'>
                    <div
                        class='d-flex flex-row flex-nowrap no-scrollbar'
                        style={`
                            overflow-x: auto;
                            overflow-y: auto;
                            scroll-snap-type: x mandatory;
                        `}
                        onScroll={this.scrollBoxes}
                        ref={c => this.scrollerRef = c}
                    >
                        {checkpoints && checkpoints.map(cp => {
                            return(<>
                                <div
                                    class='clearfix p-0 mr-2'
                                    style={`
                                        line-height: 1.1em;
                                    `}
                                    ref={c => this.elScrollerRef = c}
                                >
                                    <div
                                        class={`w-100 h-100 d-flex justify-content-center align-items-center position-relative p-1 article`}
                                        style={`
                                            scroll-snap-align: start;
                                            flex-wrap: wrap;
                                        `}
                                        onTouchstart={(e) => { e.stopPropagation(); }}
                                        onTouchend={(e) => { e.stopPropagation(); }}
                                        onTouchmove={(e) => { e.stopPropagation(); }}
                                        onClick={this.selectVideo}
                                        data-id={cp.id}
                                    >
                                        <div class='d-flex flex-row flex-nowrap h-100 w-100'>
                                            {/* <div
                                                class='bg-live-dark text-live-light'
                                                style='
                                                    width: 40%;
                                                '
                                            >
                                                <img src={youtubeThumb(art.youtube)} class='img-fluid' /><br />
                                            </div> */}
                                            <div
                                                class={`px-2 ${checkpoint === cp.id ? 'bg-live-dark text-live-light' : 'bg-live-light text-live-dark'} rounded-lg position-relative`}
                                                style='
                                                    width: 100%;
                                                    overflow: hidden;
                                                    text-overflow: ellipsis;
                                                    display: -webkit-box;
                                                    -webkit-line-clamp: 3; /* number of lines to show */
                                                            line-clamp: 3;
                                                    -webkit-box-orient: vertical;
                                                '
                                            >
                                                <nobr>
                                                    <small>
                                                        <strong>
                                                            <a href={`/webcam/${cp.id}`} class={`btn btn-link p-0 text-left ${checkpoint === cp.id ? 'text-live-light' : 'text-live-dark'} stretched-link`}>
                                                                {cp.name}
                                                            </a><br />
                                                        </strong>
                                                    </small>
                                                </nobr>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>);
                        })}
                    </div>
                </div>

            </div>
        </>);
    }
}

export default Webcam;
