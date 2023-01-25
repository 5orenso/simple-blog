import { h, Component } from 'preact';
import util from 'preact-util';
import { observer } from 'mobx-preact';
import { Text, Localizer } from 'preact-i18n';
import Markdown from 'preact-markdown';

@observer
class Results extends Component {
  	constructor(props) {
        super(props);
        this.state = {
        };
    }

    setMainView = () => {
        const { appState } = this.props.stores;
        const { mainView } = appState;
        appState.setMainView(mainView === 'results' ? null : 'results');
    }

    render() {
        const { appState } = this.props.stores;
        const { mainView } = appState;
        return (<>
            <button type='button' class={`btn ${mainView === 'results' ? 'bg-live-dark text-live-light' : 'bg-live-light text-live-dark'} mx-1 mt-1`} onClick={this.setMainView}>Resultater</button>
        </>);
    }
}

export default Results;
