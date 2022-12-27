import { h, Component } from 'preact';
import util from 'preact-util';
import { observer } from 'mobx-preact';
import { Text, Localizer } from 'preact-i18n';
import Markdown from 'preact-markdown';

@observer
class DirekteSport extends Component {
  	constructor(props) {
        super(props);
        this.state = {
        };
    }

    setMainView = () => {
        const { appState } = this.props.stores;
        const { mainView } = appState;
        appState.setMainView(mainView === 'direktesport' ? null : 'direktesport');
    }

    render() {
        const { appState } = this.props.stores;
        const { mainView } = appState;

        return (<>
            <button type='button' class={`btn btn-block ${mainView === 'direktesport' ? 'btn-success' : 'btn-info'}`} onClick={this.setMainView}>Direktesport</button>
        </>);
    }
}

export default DirekteSport;
