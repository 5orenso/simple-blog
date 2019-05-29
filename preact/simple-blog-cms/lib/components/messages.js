import { h, Component } from 'preact';

import util from '../util';

const widgetName = 'Messages';
const debug = false;
const initialState = {};

export default class Messages extends Component {
    constructor(props) {
        super(props);
        this.state = Object.assign({}, initialState);
    };

    getMessageColor(type) {
        if (type === 'error') {
            return 'danger';
        } else if (type === 'warning') {
            return 'warning';
        } else {
            return 'success';
        }
    }

    render(props, state) {
        const styles = this.props.styles;
        const messages = this.props.messages;

        if (typeof messages === 'object' && messages.length > 0) {
            return (
                <div class='col-12'>
                    <ul class='list-group'>
                        {messages.map((msg) => {
                            return (
                                <li class={`list-group-item list-group-item-${this.getMessageColor(msg[2])}`}>
                                    {msg[2] === 'error' && <i class="fas fa-exclamation-triangle mr-2"></i>}
                                    {msg[2] === 'info' && <i class="fas fa-info-circle mr-2"></i>}
                                    {msg[2] === 'done' && <i class="fas fa-check mr-2"></i>}
                                    {msg[2] === 'warning' && <i class="fas fa-exclamation-circle mr-2"></i>}
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
