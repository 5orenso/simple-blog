import { h, Component } from 'preact';

import linkstate from 'linkstate';

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
            that,
            article,
            handleClickCode,
        } = this.props;

        return (<div class='col-12'>
            <h5>Legg til lenker:</h5>
            <ul class='list-group'>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((val, idx) =>
                    <li class={`list-group-item list-group-item-action flex-column align-items-start ${idx % 2 > 0 ? 'list-group-item-secondary' : ''}`}>
                        <div class='form-group row'>
                            <div class='col-12'>
                                <label for='linkTitle'>{idx + 1}: Tittel på siden du linker til</label>
                                <input class='form-control' id='linkTitle'
                                    onInput={linkstate(that, `article.links.${val}.title`)}
                                    value={util.getString(article, 'links', val, 'title')}
                                    placeholder='Ie: Litt.no / Sorensos Blog'
                                />
                            </div>
                            <div class='col-8'>
                                <label for='link'>Link</label>
                                <input class='form-control' id='link'
                                    onInput={linkstate(that, `article.links.${val}.url`)}
                                    value={util.getString(article, 'links', val, 'url')}
                                    placeholder='Link til side, eller e-postadresse.'
                                />
                            </div>
                            <div class='col-4'>
                                <label>&nbsp;</label>
                                <button class='form-control btn btn-dark m-1'
                                    onClick={handleClickCode}
                                    data-content={`[${util.getString(article, 'links', val, 'title')}](${util.formatLink(util.getString(article, 'links', val, 'url'))})\n`}>
                                    Sett inn link i tekst
                                </button>
                            </div>
                        </div>
                    </li>
                )}
            </ul>
        </div>);
    }
}
