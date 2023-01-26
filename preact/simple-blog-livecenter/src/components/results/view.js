import { h, Component } from 'preact';
import util from 'preact-util';
import { observer } from 'mobx-preact';
import { Text, Localizer } from 'preact-i18n';
import Markdown from 'preact-markdown';

@observer
class DirekteSportView extends Component {
  	constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const { artid, bib } = this.props;
        const { appState } = this.props.stores;

        return (<>
            <div class='row'>
                <iframe
                    style='width: 100%; height: 80vh;'
                    width='800'
                    height='600'
                    src={`https://themusher.app/index#/embed/results/21/${artid || '86720279-511a-4a1d-82e6-2913af64f3a3'}${bib ? `/${bib}` : ''}`}
                    title='Tracking'
                    frameborder='0'
                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                    allowfullscreen
                />
            </div>
        </>);
    }
}

export default DirekteSportView;


