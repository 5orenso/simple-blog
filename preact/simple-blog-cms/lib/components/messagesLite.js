import { h, Component } from 'preact';

const util = require('../util');

const widgetName = 'MessagesLite';
const debug = false;
const initialState = {};

export default class MessagesLite extends Component {
    constructor(props) {
        super(props);
        this.state = Object.assign({}, initialState);
    };

    render(props, state) {
        const styles = this.props.styles;
        const messages = this.props.messages;

        if (typeof messages === 'object' && messages.length > 0) {
            return (
                <span class='float-right badge badge-success'>
                    {messages.map((msg) => {
                        return (
                            <span>
                                {util.isoDateNormalized(msg[0])}: {msg[1]}
                            </span>
                        );
                    })}
                </span>
            );
        }
    }
}
