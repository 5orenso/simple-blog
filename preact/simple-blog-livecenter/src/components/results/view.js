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
            <iframe
                style='width: 100%; height: 60vh;'
                width="800"
                height="600"
                src="https://themusher.app/index#/embed/top10/10/d7a1f4b3-4c50-4b50-bd98-baef8aa3f9bf"
                title="Tracking"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
            />

        </>);
    }
}

export default DirekteSportView;


