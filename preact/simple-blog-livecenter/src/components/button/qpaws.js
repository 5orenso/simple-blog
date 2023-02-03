import { h, Component } from 'preact';
import util from 'preact-util';
import { observer } from 'mobx-preact';
import { Text, Localizer } from 'preact-i18n';
import Markdown from 'preact-markdown';

@observer
class QpawsButton extends Component {
  	constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const { url, urlText } = this.props;
        return (<>
            <a href={'https://qpaws.com/femundlopet'} native target='_blank' class={`btn bg-live-light text-live-dark mx-1 mt-1 py-1`}>
                Tracking in
                <img src='https://themusher.app/assets/logo-qpaws-horizontal-light.png' class='img-fluid' style='height: 35px;' />
            </a>
        </>);
    }
}

export default QpawsButton;
