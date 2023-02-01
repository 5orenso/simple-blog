import { h, Component } from 'preact';
import util from 'preact-util';
import { observer } from 'mobx-preact';
import { Text, Localizer } from 'preact-i18n';
import Markdown from 'preact-markdown';

function scrollTo(element, top = 0, left = 0) {
    // element.scrollTop = to;
    if (element) {
        element.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "start",
        });
    }
}

@observer
class Webcams extends Component {
  	constructor(props) {
        super(props);
        this.state = {
        };
        this.listContainer = null;
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
        if (!showList) {
            scrollTo(this.listContainer);
        }
        this.setState({
            showList: !showList,
        });
    }

    inputCheckpoint = (props, toggleButton) => {
        const { appState } = this.props.stores;
        appState.chooseCheckpoint(null, props.artid);
        if (toggleButton) {
            const { showList } = this.state;
            this.setState({
                showList: !showList,
            });
        }
    }

    // componentWillReceiveProps(nextProps) {
    //     if (nextProps.page === 'webcam') {
    //         if (nextProps.artid !== this.props.artid) {
    //             this.inputCheckpoint(nextProps, false)
    //         }
    //     }
    // }

    // componentDidMount() {
    //     if (this.props.page === 'webcam') {
    //         this.inputCheckpoint(this.props, false);
    //     }
    // }

    render() {
        const { showList } = this.state;
        const { appState } = this.props.stores;
        const { mainView, checkpoints, checkpoint } = appState;

        return (<>
            <a href='/webcam/' class={`btn ${mainView === 'webcam' ? 'bg-live-dark text-live-light' : 'bg-live-light text-live-dark'} mx-1 mt-1`}>Webcam</a>

            {/* <button type='button' class={`btn ${mainView === 'webcam' ? 'bg-live-dark text-live-light' : 'bg-live-light text-live-dark'} mx-1 mt-1`} onClick={this.toggleList}
                ref={c => this.listContainer = c}
            >
                Webcam <i class='fas fa-bars' />
            </button> */}

            {/* {showList && <>
                <div
                    class='w-100 d-flex flex-column ml-3 mb-3'
                >
                    {checkpoints && checkpoints.map(cp => {
                        return <>
                            <a href={`/webcam/${cp.id}`} class={`btn btn-link p-0 text-left ${checkpoint === cp.id ? 'text-primary' : 'text-dark'}`}><nobr>{cp.name}</nobr></a>
                        </>;
                    })}
                </div>
            </>} */}
        </>);
    }
}

export default Webcams;
