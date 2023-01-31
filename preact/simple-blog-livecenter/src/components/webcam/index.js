import { h, Component } from 'preact';
import util from 'preact-util';
import { observer } from 'mobx-preact';
import { Text, Localizer } from 'preact-i18n';
import Markdown from 'preact-markdown';

function youtubeVideo(url) {
    if (!url) {
        return '';
    }
    let youtubeRegex;
    if (url.match(/youtube/)) {
        // eslint-disable-next-line
        youtubeRegex = /(<p>|<br>|[\s\t\n]|^)*https*:\/\/(www\.)*youtube\.com\/(.*?v=([^&\s<$]+)(&[^\s<$]+)*)/gi;
    } else if (url.match(/youtu\.be/)) {
        // eslint-disable-next-line
        youtubeRegex = /(<p>|<br>|[\s\t\n]|^)*https*:\/\/(www\.)*youtu\.be\/(([^?&\s<$]+)((\?|&)[^\s<$]+)*)/gi;
    } else {
        return (<>
            <div class='embed-responsive embed-responsive-16by9 d-flex justify-content-center align-items-center text-center'>
                Oisann, her gikk noe galt!<br />
                Finner ikke denne streamen. Prøv igjen senere...
            </div>
        </>);
    }
    // const regexp = /(^|[\s\t\n]+)https*:\/\/(www\.)*youtube\.com\/(.*?v=([^&\s]+)(&[^\s]+)*)/gi;
    const youtubeVideo = url.replace(youtubeRegex, (match, p0, p1, p2, p3, p4) => {
        return p3;
    });
    // return youtubeVideo;
    return (<>
        <div class='embed-responsive embed-responsive-16by9'>
            <iframe class='embed-responsive-item' src={`https://www.youtube.com/embed/${youtubeVideo}?rel=0`} allowfullscreen></iframe>
        </div>
    </>);
}

const weatherSymbolKeys = {
    clearsky_day: '01d',
    clearsky_night: '01n',
    clearsky_polartwilight: '01m',
    fair_day: '02d',
    fair_night: '02n',
    fair_polartwilight: '02m',
    partlycloudy_day: '03d',
    partlycloudy_night: '03n',
    partlycloudy_polartwilight: '03m',
    cloudy: '04',
    rainshowers_day: '05d',
    rainshowers_night: '05n',
    rainshowers_polartwilight: '05m',
    rainshowersandthunder_day: '06d',
    rainshowersandthunder_night: '06n',
    rainshowersandthunder_polartwilight: '06m',
    sleetshowers_day: '07d',
    sleetshowers_night: '07n',
    sleetshowers_polartwilight: '07m',
    snowshowers_day: '08d',
    snowshowers_night: '08n',
    snowshowers_polartwilight: '08m',
    rain: '09',
    heavyrain: '10',
    heavyrainandthunder: '11',
    sleet: '12',
    snow: '13',
    snowandthunder: '14',
    fog: '15',
    sleetshowersandthunder_day: '20d',
    sleetshowersandthunder_night: '20n',
    sleetshowersandthunder_polartwilight: '20m',
    snowshowersandthunder_day: '21d',
    snowshowersandthunder_night: '21n',
    snowshowersandthunder_polartwilight: '21m',
    rainandthunder: '22',
    sleetandthunder: '23',
    lightrainshowersandthunder_day: '24d',
    lightrainshowersandthunder_night: '24n',
    lightrainshowersandthunder_polartwilight: '24m',
    heavyrainshowersandthunder_day: '25d',
    heavyrainshowersandthunder_night: '25n',
    heavyrainshowersandthunder_polartwilight: '25m',
    lightssleetshowersandthunder_day: '26d',
    lightssleetshowersandthunder_night: '26n',
    lightssleetshowersandthunder_polartwilight: '26m',
    heavysleetshowersandthunder_day: '27d',
    heavysleetshowersandthunder_night: '27n',
    heavysleetshowersandthunder_polartwilight: '27m',
    lightssnowshowersandthunder_day: '28d',
    lightssnowshowersandthunder_night: '28n',
    lightssnowshowersandthunder_polartwilight: '28m',
    heavysnowshowersandthunder_day: '29d',
    heavysnowshowersandthunder_night: '29n',
    heavysnowshowersandthunder_polartwilight: '29m',
    lightrainandthunder: '30',
    lightsleetandthunder: '31',
    heavysleetandthunder: '32',
    lightsnowandthunder: '33',
    heavysnowandthunder: '34',
    lightrainshowers_day: '40d',
    lightrainshowers_night: '40n',
    lightrainshowers_polartwilight: '40m',
    heavyrainshowers_day: '41d',
    heavyrainshowers_night: '41n',
    heavyrainshowers_polartwilight: '41m',
    lightsleetshowers_day: '42d',
    lightsleetshowers_night: '42n',
    lightsleetshowers_polartwilight: '42m',
    heavysleetshowers_day: '43d',
    heavysleetshowers_night: '43n',
    heavysleetshowers_polartwilight: '43m',
    lightsnowshowers_day: '44d',
    lightsnowshowers_night: '44n',
    lightsnowshowers_polartwilight: '44m',
    heavysnowshowers_day: '45d',
    heavysnowshowers_night: '45n',
    heavysnowshowers_polartwilight: '45m',
    lightrain: '46',
    lightsleet: '47',
    heavysleet: '48',
    lightsnow: '49',
    heavysnow: '50',
};

function windDirection(deg) {
    if (deg>11.25 && deg<33.75){
        return "NNE";
    }else if (deg>33.75 && deg<56.25){
        return "ENE";
    }else if (deg>56.25 && deg<78.75){
        return "E";
    }else if (deg>78.75 && deg<101.25){
        return "ESE";
    }else if (deg>101.25 && deg<123.75){
        return "ESE";
    }else if (deg>123.75 && deg<146.25){
        return "SE";
    }else if (deg>146.25 && deg<168.75){
        return "SSE";
    }else if (deg>168.75 && deg<191.25){
        return "S";
    }else if (deg>191.25 && deg<213.75){
        return "SSW";
    }else if (deg>213.75 && deg<236.25){
        return "SW";
    }else if (deg>236.25 && deg<258.75){
        return "WSW";
    }else if (deg>258.75 && deg<281.25){
        return "W";
    }else if (deg>281.25 && deg<303.75){
        return "WNW";
    }else if (deg>303.75 && deg<326.25){
        return "NW";
    }else if (deg>326.25 && deg<348.75){
        return "NNW";
    }
    return "N";
}

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
        const { mapColorMode, drawerHeightLarge, weather } = appState;

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
                    {youtubeVideo(currentCheckpoint.camera)}

                    {/* <div class='flex-grow-1 d-flex justify-content-center'>
                        {currentCheckpoint && <>
                            {currentCheckpoint.camera && <>
                                <img src={currentCheckpoint.camera} class='img-fluid' /><br />
                            </>}
                        </>}
                    </div> */}
                    {/* <div class='d-flex flex-column ml-3'>
                        {checkpoints && checkpoints.map(cp => {
                            return <>
                            <button type='button' class={`btn btn-link p-0 text-left ${checkpoint === cp.id ? 'text-primary' : 'text-dark'}`} data-id={cp.id} onClick={this.chooseCheckpoint}><nobr>{cp.name}</nobr></button>
                            </>;
                        })}
                    </div> */}
                </div>

                {weather[0] && <>
                    <div class='w-100 d-flex flex-row justify-content-center'>

                        <div class='d-flex align-items-center'>
                            {currentCheckpoint && <>
                                {currentCheckpoint.name} <span class='d-none d-sm-inline-block ml-2'>{currentCheckpoint.altitude} moh</span>
                            </>}
                        </div>
                        <div class='d-flex flex-row align-items-center'>
                            <div class='ml-3 d-flex align-items-center'>
                                <img
                                    src={`https://yr.no/assets/images/weather-symbols/light-mode/default/svg/${weatherSymbolKeys[weather[0].next_1_hours?.summary?.symbol_code]}.svg`}
                                    width='50'
                                    height='50'
                                />
                            </div>
                            <div class='ml-3 '>
                                <i class='fas fa-temperature-low text-muted' /> {weather[0].instant?.details?.air_temperature} °C
                            </div>
                            <div class='ml-3 d-none d-sm-block'>
                                <i class='fas fa-wind text-muted' />{weather[0].instant?.details?.wind_speed} m/s - {windDirection(weather[0].instant?.details?.wind_from_direction)}
                            </div>
                            {/* <div class='mr-3 d-flex align-items-center'>{weather[0].instant?.details?.air_pressure_at_sea_level} hPa</div> */}
                            {/* <div class='mr-3 d-flex align-items-center'>{weather[0].instant?.details?.relative_humidity} %</div> */}
                        </div>
                    </div>
                </>}



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
