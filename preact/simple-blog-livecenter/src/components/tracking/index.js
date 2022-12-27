import { h, Component } from 'preact';
import util from 'preact-util';
import { observer } from 'mobx-preact';
import { Text, Localizer } from 'preact-i18n';
import Markdown from 'preact-markdown';

@observer
class Tracking extends Component {
  	constructor(props) {
        super(props);
        this.state = {
        };
    }

    setMainView = () => {
        const { appState } = this.props.stores;
        const { mainView } = appState;
        appState.setMainView(mainView === 'tracking' ? null : 'tracking');
    }

    render() {
        const { appState } = this.props.stores;
        const { mainView } = appState;
        return (<>
            <button type='button' class={`btn btn-block ${mainView === 'tracking' ? 'btn-success' : 'btn-info'}`} onClick={this.setMainView}>Tracking</button>
        </>);
    }
}

export default Tracking;
