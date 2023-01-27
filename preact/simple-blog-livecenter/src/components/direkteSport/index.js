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
            {/* <button type='button' class={`btn ${mainView === 'direktesport' ? 'btn-success' : 'btn-info'} mx-1 mt-1`} onClick={this.setMainView}>Direktesport.no</button> */}
            {/* <a class={`btn ${mainView === 'direktesport' ? 'bg-live-dark text-live-light' : 'bg-live-light text-live-dark'} mx-1 mt-1`} native target='_blank' href='https://www.direktesport.no/'>Direktesport.no</a> */}
            <a href='/direktesport' class={`btn ${mainView === 'direktesport' ? 'bg-live-dark text-live-light' : 'bg-live-light text-live-dark'} mx-1 mt-1`}>Direktesport.no</a>

        </>);
    }
}

export default DirekteSport;
