import { h, Component } from 'preact';
import util from 'preact-util';
import { observer } from 'mobx-preact';
import { Text, Localizer } from 'preact-i18n';
import Markdown from 'preact-markdown';

@observer
class Webcams extends Component {
  	constructor(props) {
        super(props);
        this.state = {
        };
    }

    setMainView = () => {
        const { appState } = this.props.stores;
        const { mainView } = appState;
        appState.setMainView(mainView === 'webcam' ? 'webcam' : 'webcam');
    }

    chooseCheckpoint = async e => {
        const { appState } = this.props.stores;
        this.setMainView();
        appState.chooseCheckpoint(e);
        await this.getWeather();
        this.toggleList();
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

    toggleList = (e) => {
        const { showList } = this.state;
        this.setState({
            showList: !showList,
        });
    }

    render() {
        const { showList } = this.state;
        const { appState } = this.props.stores;
        const { mainView, checkpoints, checkpoint } = appState;

        return (<>
            <button type='button' class={`btn btn-block ${mainView === 'webcam' ? 'btn-success' : 'btn-info'}`} onClick={this.toggleList}>
                Webcam <i class='fas fa-bars' />
            </button>

            {showList && <div class='d-flex flex-column ml-3 mb-3'>
                {checkpoints && checkpoints.map(cp => {
                    return <>
                        <button type='button' class={`btn btn-link p-0 text-left ${checkpoint === cp.id ? 'text-primary' : 'text-white'}`} data-id={cp.id} onClick={this.chooseCheckpoint}><nobr>{cp.name}</nobr></button>
                    </>;
                })}
            </div>}
        </>);
    }
}

export default Webcams;
