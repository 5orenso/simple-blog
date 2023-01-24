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
        const { appState } = this.props.stores;

        return (<>
            <div class='row'>
                <iframe
                    style='width: 100%; height: 80vh;'
                    width='800'
                    height='600'
                    src='https://themusher.app/index#/embed/results/20/1df75188-ff4b-4d17-b080-cb329a95d63d'
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


