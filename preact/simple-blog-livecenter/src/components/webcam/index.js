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
        </>);
    }
}

export default Webcam;
