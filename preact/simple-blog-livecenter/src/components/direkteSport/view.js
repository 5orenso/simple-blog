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
                <div class='w-100 d-flex flex-row justify-content-center'>
                    <iframe
                        width="800"
                        height="448"
                        src="https://www.youtube.com/embed/mVef2v1OYhw"
                        title="YouTube video player"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen
                    />
                </div>
            </div>
        </>);
    }
}

export default DirekteSportView;


