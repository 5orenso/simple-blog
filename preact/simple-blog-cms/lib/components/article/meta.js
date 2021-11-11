import { h, Component } from 'preact';

import MessagesLite from '../messagesLite';

import util from '../../util';

const initialState = {

};

const debug = false;

function pad(n) {
    return (n.length < 2) ? `0${n}` : n;
}

function isImage(filename = '') {
    return filename.match(/(jpg|jpeg|png|gif|heic|heif|svg|webp|tif)/i);
}

export default class Edit extends Component {
    constructor(props) {
        super(props);
        this.state = Object.assign({}, initialState);
    }

    render() {
        const {
        } = this.state;

        const {
        } = this.props;

        return (<div>
            MENU
        </div>);
    }
}
