import { h, Component } from 'preact';

const util = require('../util');

const widgetName = 'Messages';
const debug = false;
const initialState = {};

export default class Messages extends Component {
    constructor(props) {
        super(props);
        this.state = Object.assign({}, initialState);
    };

    render(props, state) {
        const styles = this.props.styles;
        const messages = this.props.messages;

        if (typeof messages === 'object' && messages.length > 0) {
            return (
                <div class='col-12'>
                    <ul class='list-group'>
                        {messages.map((msg) => {
                            return (
                                <li class='list-group-item list-group-item-success'>
                                    {util.isoDateNormalized(msg[0])}: {msg[1]}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            );
        }
    }
}
