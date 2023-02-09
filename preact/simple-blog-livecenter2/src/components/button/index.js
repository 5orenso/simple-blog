import { h, Component } from 'preact';
import util from 'preact-util';
import { observer } from 'mobx-preact';
import { Text, Localizer } from 'preact-i18n';
import Markdown from 'preact-markdown';

@observer
class Button extends Component {
  	constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const { url, urlText } = this.props;
        return (<>
            <a href={url} class={`btn bg-live-light text-live-dark mx-1 mt-1`}>{urlText}</a>
        </>);
    }
}

export default Button;
